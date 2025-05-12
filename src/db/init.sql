IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'maindb')
BEGIN
    CREATE DATABASE maindb;
END
GO

USE maindb;
GO

CREATE TABLE UserRoles (
    value VARCHAR(50) PRIMARY KEY
);

INSERT INTO UserRoles (value) VALUES ('admin'), ('manager'), ('user'), ('guest');
GO

CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    parent_id UNIQUEIDENTIFIER NOT NULL,
    password_hash NVARCHAR(MAX) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'user', 'guest')) DEFAULT 'user',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
    CONSTRAINT FK_Users_Parent FOREIGN KEY (parent_id) REFERENCES Users(id),
);
GO

CREATE TABLE Accounts (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    status VARCHAR(50),
    source VARCHAR(100),
    assigned_user_id UNIQUEIDENTIFIER,
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Accounts_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);
GO

CREATE TABLE Contacts (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    account_id UNIQUEIDENTIFIER,
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Contacts_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id)
);
GO

CREATE TABLE Leads (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    assigned_user_id UNIQUEIDENTIFIER,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Leads_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);
GO

CREATE TABLE Opportunities (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    account_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER,
    amount DECIMAL(15,2),
    stage VARCHAR(50) NOT NULL,
    close_date DATE,
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Opportunities_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id),
    CONSTRAINT FK_Opportunities_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);
GO

CREATE TABLE Tasks (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    body NVARCHAR(MAX),
    status VARCHAR(50) NOT NULL,
    due_date DATE,
    contact_id UNIQUEIDENTIFIER,
    sender_email VARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Tasks_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);
GO

CREATE TABLE Campaigns (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2)
);
GO

CREATE TABLE Emails (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    subject VARCHAR(255),
    body NVARCHAR(MAX),
    sender_email VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    contact_id UNIQUEIDENTIFIER,
    assigned_user_id UNIQUEIDENTIFIER,
    sent_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Emails_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    CONSTRAINT FK_Emails_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);
GO

CREATE TABLE accounts_contacts (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    account_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_AccountsContacts_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id),
    CONSTRAINT FK_AccountsContacts_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    CONSTRAINT UQ_AccountsContacts UNIQUE (account_id, contact_id)
);
GO

CREATE INDEX idx_contacts_account_id ON Contacts(account_id);
CREATE INDEX idx_opportunities_account_id ON Opportunities(account_id);
CREATE INDEX idx_opportunities_contact_id ON Opportunities(contact_id);
CREATE INDEX idx_tasks_contact_id ON Tasks(contact_id);
CREATE INDEX idx_emails_contact_id ON Emails(contact_id);
CREATE INDEX idx_accounts_assigned_user_id ON Accounts(assigned_user_id);
CREATE INDEX idx_leads_assigned_user_id ON Leads(assigned_user_id);
CREATE INDEX idx_accounts_contacts_account_id ON accounts_contacts(account_id);
CREATE INDEX idx_accounts_contacts_contact_id ON accounts_contacts(contact_id);
GO
