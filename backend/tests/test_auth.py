from __future__ import annotations

import asyncio
from datetime import timedelta

from fastapi.testclient import TestClient
from sqlalchemy import select

from app.auth.jwt import TokenType, create_password_reset_token, create_token
from app.auth.password import hash_password
from app.models.user import User, UserRole


def candidate_payload(email: str = "candidate@example.com") -> dict[str, object]:
    return {
        "first_name": "Ava",
        "last_name": "Stone",
        "email": email,
        "phone": "+15551234567",
        "password": "SecurePass123!",
        "role": "candidate",
    }


def company_payload(email: str = "company@example.com") -> dict[str, object]:
    return {
        "first_name": "Morgan",
        "last_name": "Reed",
        "email": email,
        "phone": "+15557654321",
        "password": "SecurePass123!",
        "role": "company",
        "company": {
            "company_name": "SignalWorks",
            "website": "https://signalworks.example",
            "industry": "SaaS",
            "company_size": "51-200",
            "location": "Remote",
            "description": "Hiring platform partner.",
        },
    }


def register_candidate(client: TestClient) -> dict[str, object]:
    response = client.post("/api/v1/auth/register", json=candidate_payload())
    assert response.status_code == 201
    return response.json()


def register_company(client: TestClient) -> dict[str, object]:
    response = client.post("/api/v1/auth/register", json=company_payload())
    assert response.status_code == 201
    return response.json()


async def get_user_by_email(client: TestClient, email: str) -> User:
    session_factory = client.app.state.test_session_factory
    async with session_factory() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one()
        session.expunge(user)
        return user


async def seed_admin(client: TestClient) -> None:
    session_factory = client.app.state.test_session_factory
    async with session_factory() as session:
        session.add(
            User(
                first_name="Root",
                last_name="Admin",
                email="admin@example.com",
                password_hash=hash_password("AdminSecure123!"),
                role=UserRole.ADMIN,
                is_verified=True,
            )
        )
        await session.commit()


def test_register_candidate(client: TestClient) -> None:
    payload = register_candidate(client)

    assert payload["access_token"]
    assert payload["refresh_token"]
    assert payload["user"]["email"] == "candidate@example.com"
    assert payload["user"]["role"] == "candidate"
    assert "jobs:read" in payload["user"]["permissions"]


def test_register_company_creates_company_profile(client: TestClient) -> None:
    response = client.post("/api/v1/auth/register", json=company_payload())

    assert response.status_code == 201
    payload = response.json()
    assert payload["user"]["role"] == "company"
    assert payload["user"]["company"]["company_name"] == "SignalWorks"
    assert "company:manage" in payload["user"]["permissions"]


def test_register_rejects_public_admin_role(client: TestClient) -> None:
    payload = candidate_payload("admin-register@example.com")
    payload["role"] = "admin"

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 422


def test_register_rejects_weak_password(client: TestClient) -> None:
    payload = candidate_payload("weak@example.com")
    payload["password"] = "password"

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 422


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    register_candidate(client)

    response = client.post("/api/v1/auth/register", json=candidate_payload())

    assert response.status_code == 409
    assert response.json()["detail"] == "Email is already registered"


def test_password_hash_is_not_plain_text(client: TestClient) -> None:
    register_candidate(client)

    user = asyncio.run(get_user_by_email(client, "candidate@example.com"))

    assert user.password_hash != "SecurePass123!"
    assert user.password_hash.startswith("$2b$")


def test_login_returns_jwt_tokens(client: TestClient) -> None:
    register_candidate(client)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "candidate@example.com", "password": "SecurePass123!"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["access_token"]
    assert payload["refresh_token"]
    assert payload["token_type"] == "bearer"


def test_admin_login_for_seeded_admin(client: TestClient) -> None:
    asyncio.run(seed_admin(client))

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminSecure123!"},
    )

    assert response.status_code == 200
    assert response.json()["user"]["role"] == "admin"
    assert "platform:admin" in response.json()["user"]["permissions"]


def test_protected_route_requires_valid_jwt(client: TestClient) -> None:
    auth_payload = register_candidate(client)

    missing_token = client.get("/api/v1/users/me")
    invalid_token = client.get("/api/v1/users/me", headers={"Authorization": "Bearer invalid"})
    valid_token = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
    )

    assert missing_token.status_code == 401
    assert invalid_token.status_code == 401
    assert valid_token.status_code == 200
    assert valid_token.json()["email"] == "candidate@example.com"


def test_protected_route_rejects_expired_jwt(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    expired_token, _ = create_token(
        auth_payload["user"]["uuid"],
        TokenType.ACCESS,
        expires_delta=timedelta(seconds=-1),
    )

    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )

    assert response.status_code == 401


def test_profile_update_requires_authentication(client: TestClient) -> None:
    auth_payload = register_candidate(client)

    unauthenticated = client.patch("/api/v1/users/me", json={"first_name": "Eve"})
    authenticated = client.patch(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
        json={"first_name": "Eve", "phone": "+15559876543"},
    )

    assert unauthenticated.status_code == 401
    assert authenticated.status_code == 200
    assert authenticated.json()["first_name"] == "Eve"
    assert authenticated.json()["phone"] == "+15559876543"


def test_candidate_dashboard_placeholder_requires_candidate_role(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    asyncio.run(seed_admin(client))
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "AdminSecure123!"},
    )

    unauthenticated = client.get("/api/v1/candidate/dashboard")
    candidate = client.get(
        "/api/v1/candidate/dashboard",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
    )
    admin = client.get(
        "/api/v1/candidate/dashboard",
        headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
    )

    assert unauthenticated.status_code == 401
    assert candidate.status_code == 200
    assert candidate.json()["summary"]["profile_completion"] == 75
    assert admin.status_code == 403


def test_candidate_profile_placeholder_requires_candidate_role(client: TestClient) -> None:
    auth_payload = register_candidate(client)

    response = client.get(
        "/api/v1/candidate/profile",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "candidate@example.com"
    assert response.json()["profile_completion"] == 75


def test_candidate_profile_placeholder_update_returns_dummy_payload(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    profile_payload = {
        "first_name": "Ava",
        "last_name": "Stone",
        "headline": "Senior Frontend Engineer",
        "avatar_url": None,
        "email": "candidate@example.com",
        "phone": "+15551234567",
        "address_line": "100 Market Street",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "postal_code": "94105",
        "date_of_birth": "1995-04-12",
        "gender": "Female",
        "bio": "Building polished product experiences.",
        "skills": ["React", "TypeScript"],
        "education": ["B.S. Computer Science"],
        "work_experience": ["Frontend Engineer - SignalWorks"],
        "certifications": ["AWS Cloud Practitioner"],
        "languages": ["English"],
        "portfolio_url": "https://portfolio.example.com",
        "github_url": "https://github.com/ava",
        "linkedin_url": "https://www.linkedin.com/in/ava",
        "website_url": "https://ava.example.com",
        "profile_completion": 90,
    }

    response = client.put(
        "/api/v1/candidate/profile",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
        json=profile_payload,
    )

    assert response.status_code == 200
    assert response.json()["uuid"] == auth_payload["user"]["uuid"]
    assert response.json()["headline"] == "Senior Frontend Engineer"
    assert response.json()["profile_completion"] == 90


def test_candidate_resume_placeholder_endpoints(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    headers = {"Authorization": f"Bearer {auth_payload['access_token']}"}

    current_resume = client.get("/api/v1/candidate/resume", headers=headers)
    upload_resume = client.post(
        "/api/v1/candidate/resume",
        headers=headers,
        files={"file": ("resume.pdf", b"%PDF-1.4 dummy", "application/pdf")},
    )
    delete_resume = client.delete("/api/v1/candidate/resume", headers=headers)

    assert current_resume.status_code == 200
    assert current_resume.json()["current_resume"]["file_name"] == "Ava-Stone-Resume.pdf"
    assert upload_resume.status_code == 201
    assert upload_resume.json()["current_resume"]["file_name"] == "resume.pdf"
    assert upload_resume.json()["current_resume"]["file_type"] == "PDF"
    assert delete_resume.status_code == 200
    assert delete_resume.json()["current_resume"] is None


def test_candidate_resume_upload_rejects_unsupported_file(client: TestClient) -> None:
    auth_payload = register_candidate(client)

    response = client.post(
        "/api/v1/candidate/resume",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
        files={"file": ("resume.txt", b"plain text", "text/plain")},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Only PDF and DOCX resumes are supported"


def test_jobs_placeholder_list_supports_search_and_pagination(client: TestClient) -> None:
    response = client.get("/api/v1/jobs", params={"search": "React", "page": 1, "page_size": 3})

    assert response.status_code == 200
    payload = response.json()
    assert payload["total"] >= 3
    assert len(payload["jobs"]) == 3
    assert all("React" in job["skills"] or "React" in job["title"] for job in payload["jobs"])


def test_candidate_job_management_placeholder_endpoints(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    headers = {"Authorization": f"Bearer {auth_payload['access_token']}"}

    saved_jobs = client.get("/api/v1/candidate/saved-jobs", headers=headers)
    applied_jobs = client.get("/api/v1/candidate/applied-jobs", headers=headers)
    save_job = client.post(
        "/api/v1/candidate/save-job", headers=headers, json={"job_id": "job-002"}
    )
    apply_job = client.post(
        "/api/v1/candidate/apply-job", headers=headers, json={"job_id": "job-002"}
    )

    assert saved_jobs.status_code == 200
    assert saved_jobs.json()["total"] >= 1
    assert applied_jobs.status_code == 200
    assert applied_jobs.json()["total"] >= 1
    assert applied_jobs.json()["applications"][0]["timeline"]
    assert save_job.status_code == 200
    assert save_job.json()["status"] == "saved"
    assert apply_job.status_code == 200
    assert apply_job.json()["status"] == "applied"


def test_candidate_resume_analysis_placeholder_endpoints(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    headers = {"Authorization": f"Bearer {auth_payload['access_token']}"}

    report = client.get("/api/v1/ai/report", headers=headers)
    analysis = client.post(
        "/api/v1/ai/resume-analysis",
        headers=headers,
        json={"resume_id": "resume-current"},
    )

    assert report.status_code == 200
    assert analysis.status_code == 200
    assert report.json()["ats_score"] == 86
    assert analysis.json()["job_match"] == 82
    assert len(analysis.json()["sections"]) == 4


def test_resume_analysis_requires_candidate_authentication(client: TestClient) -> None:
    response = client.get("/api/v1/ai/report")

    assert response.status_code == 401


def test_company_dashboard_placeholder_endpoints(client: TestClient) -> None:
    auth_payload = register_company(client)
    headers = {"Authorization": f"Bearer {auth_payload['access_token']}"}

    dashboard = client.get("/api/v1/company/dashboard", headers=headers)
    profile = client.get("/api/v1/company/profile", headers=headers)
    jobs = client.get("/api/v1/company/jobs", headers=headers)
    applicants = client.get("/api/v1/company/applicants", headers=headers)
    analytics = client.get("/api/v1/company/analytics", headers=headers)

    assert dashboard.status_code == 200
    assert dashboard.json()["summary"]["active_jobs"] == 8
    assert profile.status_code == 200
    assert profile.json()["company_name"] == "Northstar Labs"
    assert jobs.status_code == 200
    assert jobs.json()["total"] == 4
    assert applicants.status_code == 200
    assert applicants.json()["total"] == 4
    assert analytics.status_code == 200
    assert len(analytics.json()["hiring_funnel"]) == 5


def test_company_job_placeholder_mutations(client: TestClient) -> None:
    auth_payload = register_company(client)
    headers = {"Authorization": f"Bearer {auth_payload['access_token']}"}
    payload = {
        "title": "Platform Engineer",
        "department": "Engineering",
        "employment_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$150k-$190k",
        "location": "Remote",
        "work_mode": "Remote",
        "skills": ["Python", "Kubernetes"],
        "education": "Equivalent experience",
        "description": "Build reliable infrastructure for the AIHire Pro platform.",
        "responsibilities": ["Own platform reliability"],
        "requirements": ["Five years of experience"],
        "benefits": ["Remote-first"],
        "application_deadline": "2026-09-30",
        "status": "active",
    }

    created = client.post("/api/v1/company/jobs", headers=headers, json=payload)
    updated = client.put("/api/v1/company/jobs/job-1", headers=headers, json=payload)
    deleted = client.delete("/api/v1/company/jobs/job-1", headers=headers)

    assert created.status_code == 201
    assert updated.status_code == 200
    assert deleted.status_code == 200
    assert deleted.json()["status"] == "deleted"


def test_candidate_cannot_access_company_dashboard(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    response = client.get(
        "/api/v1/company/dashboard",
        headers={"Authorization": f"Bearer {auth_payload['access_token']}"},
    )

    assert response.status_code == 403


def test_refresh_token_rotation_revokes_old_token(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    old_refresh_token = auth_payload["refresh_token"]

    first_refresh = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": old_refresh_token}
    )
    second_refresh = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": old_refresh_token}
    )

    assert first_refresh.status_code == 200
    assert first_refresh.json()["refresh_token"] != old_refresh_token
    assert second_refresh.status_code == 401


def test_access_token_cannot_be_used_as_refresh_token(client: TestClient) -> None:
    auth_payload = register_candidate(client)

    response = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": auth_payload["access_token"]}
    )

    assert response.status_code == 401


def test_logout_revokes_refresh_token(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    refresh_token = auth_payload["refresh_token"]

    logout = client.post("/api/v1/auth/logout", json={"refresh_token": refresh_token})
    refresh = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

    assert logout.status_code == 200
    assert refresh.status_code == 401


def test_forgot_password_returns_generic_message(client: TestClient) -> None:
    register_candidate(client)

    existing = client.post("/api/v1/auth/forgot-password", json={"email": "candidate@example.com"})
    missing = client.post("/api/v1/auth/forgot-password", json={"email": "missing@example.com"})

    assert existing.status_code == 200
    assert missing.status_code == 200
    assert existing.json() == missing.json()


def test_reset_password_changes_password_and_blocks_replay(client: TestClient) -> None:
    auth_payload = register_candidate(client)
    user = asyncio.run(get_user_by_email(client, "candidate@example.com"))
    reset_token = create_password_reset_token(user.uuid, user.password_hash)

    reset = client.post(
        "/api/v1/auth/reset-password",
        json={"token": reset_token, "password": "NewSecurePass123!"},
    )
    old_login = client.post(
        "/api/v1/auth/login",
        json={"email": "candidate@example.com", "password": "SecurePass123!"},
    )
    new_login = client.post(
        "/api/v1/auth/login",
        json={"email": "candidate@example.com", "password": "NewSecurePass123!"},
    )
    replay = client.post(
        "/api/v1/auth/reset-password",
        json={"token": reset_token, "password": "AnotherSecure123!"},
    )
    old_refresh = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": auth_payload["refresh_token"]}
    )

    assert reset.status_code == 200
    assert old_login.status_code == 401
    assert new_login.status_code == 200
    assert replay.status_code == 400
    assert old_refresh.status_code == 401
