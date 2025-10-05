document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const mainNav = document.getElementById("main-nav");
  const loginSection = document.getElementById("login-section");

  const checkAuthentication = () => {
    if (!token) {
      hideAllSections();
      mainNav.style.display = "none";
      loginSection.style.display = "block";
    } else {
      mainNav.style.display = "block";
      loginSection.style.display = "none";
    }
  };
  checkAuthentication();

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        await login(email, password);
        loginError.style.display = "none";
        loginSection.style.display = "none";
        mainNav.style.display = "block";
      } catch (err) {
        loginError.style.display = "block";
        console.error("Login failed:", err);
      }
    });
  }

  const companiesLink = document.getElementById("companies");
  if (companiesLink) {
    companiesLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await showCompanies();
    });
  }

  const logoutLink = document.getElementById("logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
      logout();
      location.reload();
    });
  }

  const addCompanyForm = document.getElementById("add-company-form");
  if (addCompanyForm) {
    addCompanyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("company-name").value;
      const email = document.getElementById("company-email").value;

      try {
        await addCompany(name, email);
        addCompanyForm.reset();
        await fetchCompanies();
      } catch (error) {
        console.error("Failed to add company:", error);
      }
    });
  }
});

const fetchCompanies = async () => {
  try {
    const companies = await apiFetch("companies");
    const companiesList = document.getElementById("companies-list");
    companiesList.innerHTML = "";

    companies.forEach((company) => {
      const listItem = document.createElement("li");
      listItem.textContent = ` ${company.name} - ${company.email};`;
      companiesList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
  }
};

const showCompanies = async () => {
  hideAllSections();
  const companiesSection = document.getElementById("companies-section");
  const loginSection = document.getElementById("login-section");
  const addCompanySection = document.getElementById("add-company-section");

  companiesSection.style.display = "block";
  loginSection.style.display = "none";
  addCompanySection.style.display = "block";

  await fetchCompanies();
};

const addCompany = async (name, email) => {
  try {
    await apiFetch("companies", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        interesting: [],
      }),
    });
  } catch (error) {
    console.error("Failed to add company:", error);
  }
};

const hideAllSections = () => {
  const sections = [
    document.getElementById("login-section"),
    document.getElementById("companies-section"),
    document.getElementById("candidates-section"),
    document.getElementById("reports-section"),
    document.getElementById("add-company-section"),
    document.getElementById("users-section"),
  ];

  sections.forEach((section) => {
    if (section) {
      section.style.display = "none";
    }
  });
};

// -------------------------------------------

const fetchCandidates = async () => {
  try {
    const candidates = await apiFetch("candidates");
    return candidates;
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }
};

const showCandidates = async () => {
  hideAllSections();
  try {
    const candidatesSection = document.getElementById("candidates-section");
    const loginSection = document.getElementById("login-section");
    const companiesSection = document.getElementById("companies-section");

    candidatesSection.style.display = "block";
    loginSection.style.display = "none";
    companiesSection.style.display = "none";

    const candidates = await fetchCandidates();
    const candidatesList = document.getElementById("candidates-list");

    candidatesList.innerHTML = "";

    candidates.forEach((candidate) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <img src="${candidate.avatar}" alt="${candidate.name}" width="50" height="50" />
        <strong>${candidate.name}</strong> (${candidate.email})
      ;`;
      candidatesList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error displaying candidates:", error);
  }
};

const candidatesLink = document.getElementById("candidates");
if (candidatesLink) {
  candidatesLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await showCandidates();
  });
}

// --------- Dodavanje Reports JS ----------

const fetchReports = async () => {
  try {
    const reports = await apiFetch("reports");
    return reports;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    throw error;
  }
};

const showReports = async () => {
  await populateReportFormOptions();
  await populateCompaniesDropdown();
  try {
    const reportsSection = document.getElementById("reports-section");
    const loginSection = document.getElementById("login-section");
    const companiesSection = document.getElementById("companies-section");
    const candidatesSection = document.getElementById("candidates-section");
    const usersSection = document.getElementById("users-section");

    reportsSection.style.display = "block";
    loginSection.style.display = "none";
    companiesSection.style.display = "none";
    candidatesSection.style.display = "none";
    usersSection.style.display = "none";

    const reports = await fetchReports();
    const reportsList = document.getElementById("reports-list");

    reportsList.innerHTML = ""; // Reset liste izveštaja

    reports.forEach((report) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>Candidate:</strong> ${report.candidateName}<br>
        <strong>Company:</strong> ${report.companyName}<br>
        <strong>Phase:</strong> ${report.phase}<br>
        <strong>Status:</strong> ${report.status}<br>
        <strong>Note:</strong> ${report.note}
        <br>
        <button class="edit-report" data-id="${report.id}">Edit</button>
        <button class="delete-report" data-id="${report.id}">Delete</button>
      `;
      reportsList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error displaying reports:", error);
  }
};

const reportsLink = document.getElementById("reports");
if (reportsLink) {
  reportsLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await showReports();
  });
}

const addReport = async (report) => {
  try {
    await apiFetch("reports", {
      method: "POST",
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error("Failed to add report:", error);
    throw error;
  }
};

const addReportForm = document.getElementById("add-report-form");
if (addReportForm) {
  addReportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const report = {
      candidateId: document.getElementById("candidate-id").value,
      candidateName:
        document.getElementById("candidate-id").selectedOptions[0].text,
      companyId: document.getElementById("company-id").value,
      companyName:
        document.getElementById("company-id").selectedOptions[0].text,
      phase: document.getElementById("phase").value,
      status: document.getElementById("status").value,
      note: document.getElementById("note").value,
      interviewDate: new Date().toISOString(),
    };

    try {
      await addReport(report);
      addReportForm.reset();
      await showReports();
    } catch (error) {
      console.error("Failed to add report:", error);
    }
  });
}

const populateReportFormOptions = async () => {
  try {
    const candidates = await fetchCandidates();
    const companies = await fetchCompanies();

    const candidateSelect = document.getElementById("candidate-id");
    const companySelect = document.getElementById("company-id");

    candidateSelect.innerHTML = "";
    companySelect.innerHTML = "";

    candidates.forEach((candidate) => {
      const option = document.createElement("option");
      option.value = candidate.id;
      option.textContent = candidate.name;
      candidateSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to populate report form options:", error);
  }
};

const populateCompaniesDropdown = async () => {
  try {
    const companies = await apiFetch("companies");
    const companySelect = document.getElementById("company-id");

    companySelect.innerHTML = "";

    companies.forEach((company) => {
      const option = document.createElement("option");
      option.value = company.id;
      option.textContent = company.name;
      companySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
  }
};

const deleteReport = async (id) => {
  try {
    console.log("Deleting report with ID:", id);
    await apiFetch(`reports/${id}`, { method: "DELETE" });
    await showReports();
  } catch (error) {
    console.error("Failed to delete report:", error);
  }
};

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-report")) {
    const reportId = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this report? - " + reportId)) {
      await deleteReport(reportId);
    }
  } else if (e.target.classList.contains("edit-report")) {
    console.log("Edit button clicked");

    const reportId = e.target.getAttribute("data-id");
    console.log("Editing report ID:", reportId);

    const reports = await apiFetch("reports");
    const report = reports.find((r) => r.id === parseInt(reportId));
    openEditForm(report);
  }
});

const openEditForm = (report) => {
  const modal = document.getElementById("edit-report-modal");
  modal.style.display = "block";

  document.getElementById("edit-phase").value = report.phase;
  document.getElementById("edit-status").value = report.status;
  document.getElementById("edit-note").value = report.note;

  modal.setAttribute("data-id", report.id);
};

document.getElementById("cancel-edit").addEventListener("click", () => {
  document.getElementById("edit-report-modal").style.display = "none";
  showReports();
});

const saveReportChanges = async (id, updatedReport) => {
  try {
    await apiFetch(`reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedReport),
    });
    await fetchReports();
  } catch (error) {
    console.error("Failed to update report:", error);
  }
};

document
  .getElementById("edit-report-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const modal = document.getElementById("edit-report-modal");
    const id = modal.getAttribute("data-id");

    const updatedReport = {
      phase: document.getElementById("edit-phase").value,
      status: document.getElementById("edit-status").value,
      note: document.getElementById("edit-note").value,
    };

    try {
      await apiFetch(`reports/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedReport),
      });

      await showReports(); // Vraća listu reportova
      modal.style.display = "none"; // Sakriva modal
    } catch (error) {
      console.error("Failed to save report changes:", error);
    }
  });

// --------- Dodavanje Users JS ----------

const fetchUsers = async () => {
  try {
    const users = await apiFetch("users");
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

const addUser = async (user) => {
  try {
    await apiFetch("users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    await showUsers();
  } catch (error) {
    console.error("Failed to add user:", error);
  }
};

const deleteUser = async (id) => {
  try {
    await apiFetch(`users/${id}`, { method: "DELETE" });
    await showUsers();
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
};

const showUsers = async () => {
  hideAllSections();
  try {
    const usersSection = document.getElementById("users-section");
    usersSection.style.display = "block";

    const usersList = document.getElementById("users-list");
    usersList.innerHTML = "";

    const users = await fetchUsers();
    users.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${user.email}</strong> (${user.name})
        <button class="delete-user" data-id="${user.id}">Delete</button>
      `;
      usersList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error displaying users:", error);
  }
};

// Event listener za brisanje korisnika
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-user")) {
    const userId = e.target.getAttribute("data-id");
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  }
});

const addUserForm = document.getElementById("add-user-form");
if (addUserForm) {
  addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      name: document.getElementById("user-name").value,
      email: document.getElementById("user-email").value,
      password: document.getElementById("user-password").value,
    };

    try {
      await addUser(user);
      addUserForm.reset();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  });
}

const usersLink = document.getElementById("users");
if (usersLink) {
  usersLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await showUsers();
  });
}
