USE SysAuth;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Credentials;
TRUNCATE TABLE Employees;
SET FOREIGN_KEY_CHECKS = 1;

GRANT ALL PRIVILEGES ON SysAuth.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

INSERT INTO Employees (EmployeeID, FirstName, LastName, Role) VALUES
(12345, 'John', 'Doe', 'ADMIN'),
(12346, 'Jane', 'Doe', 'USER');

INSERT INTO Credentials (ID, email, Password) VALUES
(12345, 'admin@example.com', '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK'),
(12346, 'user@example.com',  '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK');