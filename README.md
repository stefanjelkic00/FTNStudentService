FTNStudentService is an application designed for students and staff of the Faculty of Technical Sciences,
providing various services such as course overview, exam registration and grading.
The logic is created as an extension to the existing Faculty of Technical Sciences website,
with the goal of serving as a student web service and professor web service.

Technologies used are:
Backend: ASP.NET Core
Frontend: React.js
Database: SQL Server

Backend:
.NET 8 (ASP.NET Core Web API)     -Version used
Entity Framework Core (EF Core)    -ORM (Object-Relational Mapping) tool for easy database work using C# objects
SQL Server                         -Relational database used for storing all entities (users, departments, programs, courses, other inter-relations and connections)
JWT (JSON Web Token)               -For authentication and authorization of system users (student, professor, admin)
Swagger                            -Documentation and API testing directly from browser
Modular structure within backend part.
All services, interfaces and logic separated by responsibility (IService, ServiceImplementation, Controller).
Running backend: dotnet run
Backend path: http://localhost:5299/api

Frontend:
React                              -JavaScript library for building fast and interactive user interface (SPA)
Axios                              -HTTP client used for communication with .NET backend API
React Bootstrap                    -React components based on Bootstrap framework for faster development of responsive and consistent design
Formik                             -Library for managing forms and validation in React applications
Yup                                -Form validation library used in combination with Formik
JWT Decode                         -Decoding JWT tokens on client side for authorization and content display based on user role
React Toastify                     -Displaying notifications and user messages
Running frontend:
Install all dependencies: npm install
Start React application: npm start
Application will be available at: http://localhost:3000

Database:
SQL Server (Microsoft SQL Server).
Data for entering departments, programs and courses to be entered through query that will be located at the bottom of the readme file.
Relations between them as well.
As for professors and students, it's best to enter them manually through registration.
Administrator to be entered manually through database query as there is no registration for admin.
As for all other tables, they will be populated through further application testing and there's no need for entering data through queries.
All queries will be located at the bottom below functionality description.

Functionalities:
Everyone: These are homepage functionalities that don't require user to be logged in to access.
Homepage contains general information about our site.
At the very top there are buttons for displaying faculty information that take us to the next page showing all departments and programs.
When clicking on a department, it takes us to a new window displaying the department name and all programs belonging to the selected department.
When clicking on a program, it takes us to a new window displaying the program name and all courses belonging to that program and names of professors teaching those courses.
Next on homepage is a contact button that takes us to the actual contact section of the official Faculty of Technical Sciences website, considering the site logic is an extension of the FTN website.
Below that are some basic information about Faculty of Technical Sciences, number of students, employees, laboratories, library units and departments.
Along with that are images of the faculty and the city of Novi Sad where the faculty originates from.
Below that is a news section and below that is a button taking us to the actual FTN website and enrollment for next year.
Below that are images of some of the main FTN buildings and below that we have a button taking us to homepage with description "Join the FTN community".

Student:
Has a profile button that takes them to personal data and password change option.
When logged in, automatically redirected to profile page.
Has a window displaying program with all courses in that program and number of ECTS credits each course has.
Has option in new window to register for exams that aren't already registered.
Has next window displaying passed courses with their names, individual ECTS credits and grades.
Also displays total number of ECTS credits and average grade from all passed courses for that student.
In next window there's a section listing all registered courses where student can see which courses they registered for examination.

Professor:
Has a profile button that takes them to personal data and password change option.
When logged in, automatically redirected to profile page.
Has window titled "My courses and registered students" where all courses are arranged by programs with exam registrations from students listed below them.
Professor has duty to grade those courses for students with grades from 5-10.
Next window is "Graded students" where professor has insight into all exam registrations they graded with passing grade.
Colors around grade change based on grade professor assigned:
6-red
7,8-yellow
9-10-green
Next window is "Courses for application" listing all courses the professor doesn't teach with buttons for applying to be assigned to those courses.
Next window is "My requests" listing all requests the professor submitted.
If administrator approved them, it will show in green on right side "approved", while pending shows in yellow frame "pending" and next to it in red frame "cancel".

Admin:
Has a profile button that takes them to personal data and password change option.
When logged in, automatically redirected to profile page.
Has window "Professor requests" listing all submitted requests from professors for course applications where admin can approve or reject the request.
Next window is "Users" listing all registered application users under sections students and professors, with ability to completely remove users and all their logic up to that point.
Next window is "Departments" where user has complete CRUD for departments.
Next window is "Programs" where user has complete CRUD for programs.
Next window is "Courses" where user has complete CRUD for courses.
Query for entering all Departments, Programs, Courses and their relations for better and more precise generated application and data within it:

INSERT INTO Katedre (Naziv) VALUES 
('Computer Science and Automation'),
('Software Engineering'),
('Electronics'),
('Industrial Engineering and Management'),
('Telecommunications and Signal Processing');

INSERT INTO Smerovi (Naziv) VALUES
('Computer Engineering'),
('Automation and Electronics'),
('Software Systems'),
('Robotics'),
('Embedded Systems'),
('Software Engineering'),
('Information Systems'),
('Game Programming'),
('Web Programming'),
('Computer Graphics'),
('Electronics'),
('Microelectronics'),
('Digital Systems'),
('Microprocessor Systems'),
('Electronic Measurements'),
('Industrial Engineering'),
('Engineering Management'),
('Work Organization'),
('Logistics'),
('Quality and Standardization'),
('Telecommunications'),
('Signal Processing'),
('Wireless Communications'),
('Mobile Networks'),
('Internet of Things (IoT)');

INSERT INTO Predmeti (Naziv, BrojEspb) VALUES
('Mathematics 1', 8),
('Programming Fundamentals', 8),
('Algorithms and Data Structures', 6),
('Databases', 6),
('Operating Systems', 6),
('Computer Networks', 6),
('Electronics 1', 5),
('Digital Logic', 5),
('Object-Oriented Programming', 5),
('Software Engineering', 5);

INSERT INTO SmerKatedra (KatedreId, SmeroviId) VALUES
(1, 1), (1, 2), (1, 4), (1, 5), (1, 9),
(2, 3), (2, 6), (2, 7), (2, 8), (2, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
(5, 21), (5, 22), (5, 23), (5, 24), (5, 25);

INSERT INTO PredmetSmer (PredmetiId, SmeroviId) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(1, 6), (2, 6), (3, 6), (4, 6), (5, 6),
(6, 6), (7, 6), (8, 6), (9, 6), (10, 6),
(2, 3), (3, 3), (4, 3), (9, 3), (10, 3),
(3, 8), (4, 8), (5, 8), (9, 8), (10, 8),
(4, 9), (5, 9), (6, 9), (9, 9), (10, 9),
(6, 11), (7, 11), (8, 11), (9, 11), (10, 11),
(5, 21), (6, 21), (7, 21), (9, 21), (10, 21);








  

  
  
