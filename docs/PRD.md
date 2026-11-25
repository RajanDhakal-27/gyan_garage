

GYAN GARAGE
## PRODUCT REQUIREMENTS
## DOCUMENT
## GYAN GARAGE
## Learn. Practice. Progress.
Product: Student and teacher learning platform
Project context: EdTech website; team of 6; four-day build window
Document status: Draft PRD — scope intentionally limited to a four-day MVP
## Purpose
GYAN GARAGE is a proposed website for students and teachers. The product should bring learning resources, practice
activities, teacher-managed work and student study planning into one simple platform. It should serve learners beyond
SEE preparation, including school students, tuition learners and other students.
ASSUMPTION: The first release is a demonstrable MVP rather than a production-ready education service. This
interpretation is based on the stated four-day development window.
How to read this document
Must means included in the four-day MVP. Later means acknowledged in the product vision but excluded from the first
build. Any missing product decision is written as TODO: [question]. Every inferred decision is explicitly marked
## ASSUMPTION:.

GYAN GARAGE | Draft PRDPage 2
- Product overview
Problem statement
The team wants to create a shared student-and-teacher website with study materials, tests, homework, productivity tools
and learning links. The product opportunity is to organize these activities in one place instead of presenting them as
disconnected tools.
Target users
-  Students: school students, SEE learners, Grade 11–12 learners, tuition/coaching learners and other learners.
-  Teachers: teachers or tutors who provide learning materials, quizzes, homework and online-class links.
TODO: [Which grades, curricula, subjects and learner groups must the MVP explicitly support?]
TODO: [Will teachers be able to manage their own classes/students, or will the MVP use one shared demo
teacher account?]
Product goals
-  Give students a straightforward place to access study resources and practise.
-  Let teachers publish learning materials, quizzes and homework.
-  Help students organize tasks and study targets.
-  Keep the interface simple and usable for the intended Nepali student audience.
Non-goals for the four-day MVP
-  Paid membership, subscription billing or payment gateway.
-  Built-in video conferencing; online classes use an external meeting link.
-  AI-powered summary generation.
-  Games such as tic-tac-toe.
-  Advanced automated routine generation, recommendation engines or analytics.
ASSUMPTION: These items are deferred because they are not required to demonstrate the central teacher-to-student learning workflow
within four days.
- MVP scope — five Must features
MUST 1 — Role-based entry and portals
Provide login/signup screens and separate student and teacher portal views. Show navigation and actions appropriate to
the selected role.
Open decisions: TODO: [What authentication method and user database will be used?]
TODO: [Are real accounts required, or are demo accounts acceptable for the presentation?]
MUST 2 — Learning resource library
Students can browse learning materials such as notes and question papers. Resources should be organized by available
subject/topic information. Teachers can add or manage resource entries. A resource may include a YouTube link or an
online-class meeting link.
Open decisions: TODO: [Will files be uploaded, linked externally, or both?]
TODO: [Which subject/grade categories and sample resources will be supplied by the team?]

GYAN GARAGE | Draft PRDPage 3
MUST 3 — Quiz/test with timer and result
Teachers can create a basic quiz/test using objective questions. Students can attempt it, use a countdown timer, submit
answers and see an automatically calculated result.
Open decisions: TODO: [Which question types are required beyond MCQ, if any?]
TODO: [Should students see correct answers and explanations after submission?]
MUST 4 — Homework workflow
Teachers can create homework with instructions and a due date. Students can view assigned homework and its
deadline.
Open decisions: TODO: [Does the MVP require students to upload/submit completed homework, or only view the assignment?]
MUST 5 — Student study planner
Students can create and manage a simple to-do list and study targets. The dashboard displays the student's current
tasks and targets.
Open decisions: TODO: [Should tasks/targets be personal only, or can teachers assign them?]
TODO: [What exact progress indicator is required for the MVP?]
- Later / out of MVP
The following ideas are part of the team's stated feature vision, but are not Must requirements for the four-day release:
-  Stopwatch as a separate tool (a countdown timer is included in Must 3).
-  Streaks and reward/badge system.
-  AI summary maker.
-  Automatic routine maker based on a student's schedule.
-  Membership and paid features.
-  Built-in online classes; external Zoom/meeting links are in scope only as resource links.
-  Fun games such as tic-tac-toe.
-  Feedback and queries workflow.
-  Advanced targets, analytics and performance reporting.
ASSUMPTION: The team may demonstrate a later feature as a static concept only if the five Must features are complete; it must not be
presented as a working feature unless it works.

GYAN GARAGE | Draft PRDPage 4
- Key user workflows
Student workflow
- Student enters the student portal.
- Student browses notes or question papers.
- Student opens an available quiz/test and completes it before the timer ends.
- Student submits and views the result.
- Student checks homework and manages personal study tasks/targets.
Teacher workflow
- Teacher enters the teacher portal.
- Teacher adds a learning resource or link.
- Teacher creates a quiz/test with questions and a time limit.
- Teacher creates homework with instructions and a due date.
- Student-facing views display the published resources, quiz and homework.
ASSUMPTION: The MVP does not require class rosters, student enrollment approval, grading of uploaded homework or real-time
notifications unless the team confirms otherwise.
- Functional requirements and acceptance criteria
AreaAcceptance criteria for MVP
PortalsA user can enter the student or teacher experience; each portal shows its own navigation and relevant actions.
ResourcesA teacher can add a resource entry; a student can find and open that resource or its external link.
Quiz/testA teacher can create a quiz; a student can start, answer, submit and receive a calculated result.
TimerThe quiz timer visibly counts down and the attempt can be submitted when time expires.
HomeworkA teacher can create homework with a due date; the student can see the assignment and deadline.
PlannerA student can add, view, edit and complete a personal task/target.
PersistenceTODO: [Confirm persistence requirement across refreshes, browsers and separate user devices.]
Responsive UICore pages remain usable on desktop and mobile-sized screens.
- Data and technical decisions
The team explicitly identified databases as part of the project requirements. The technology stack and database choice
have not yet been confirmed in the available notes.
TODO: [Which frontend, backend, database and hosting technologies has the team selected?]
TODO: [Who will own database setup, schema design, authentication and deployment?]
TODO: [What data must persist: accounts, resources, quizzes, attempts, homework, tasks and targets?]
ASSUMPTION: Keep the implementation as small as possible for the four-day deadline. Do not add a separate
service or framework unless the team has already selected it or a Must requirement cannot otherwise be met.
Minimum conceptual data entities
-  User — account identity and role (student/teacher).
-  Resource — title, type, subject/topic, description and external link or file reference.
-  Quiz and Question — quiz details, questions, options, correct answer and time limit.
-  Quiz Attempt — student, quiz, submitted answers, score and attempt time.

GYAN GARAGE | Draft PRDPage 5
-  Homework — title, instructions, due date and teacher reference.
-  Study Task/Target — student, task description, completion state and target details.
ASSUMPTION: These are conceptual entities to guide discussion, not a finalized database schema. Field definitions and relationships
require team confirmation.
- Four-day delivery approach
The team has six members and four days. The schedule below is a proposed sequencing approach, not a claim that work
has already been assigned or completed.
DayFocusExit condition
Day 1Confirm scope, UI/navigation, repository, data model and
portal skeleton.
The main pages and shared structure are ready to integrate.
Day 2Build resource library, quiz creation/attempt flow and
homework workflow.
The core teacher-to-student content flow works.
Day 3Build student planner, connect data and integrate the
portals.
The five Must features work together in one build.
Day 4Test workflows, fix defects, check responsive behavior and
prepare the demo.
A stable MVP can be demonstrated end to end.
- Risks and dependencies
-  Scope risk: The original feature list is much larger than a four-day MVP. Protect the five Must features.
-  Integration risk: Six contributors can create inconsistent interfaces, data structures and file ownership. Agree on
contracts before parallel work.
-  Database/authentication risk: The stack, database and authentication approach are undecided in the notes.
-  Content risk: The team has not specified which verified Nepali curriculum resources, question papers or sample
content it can provide.
-  External-link risk: YouTube and Zoom/meeting links depend on valid links being supplied and maintained.
TODO: [Who supplies and verifies educational content and question-paper permissions?]
TODO: [What is the target deployment environment and who controls it?]
- Success definition for the MVP
The MVP is ready for demonstration when the team can show a complete, connected teacher-to-student workflow: a
teacher adds a learning resource, creates a quiz and homework; a student accesses the resource, attempts the quiz,
sees a result and views homework; the student can also manage a study task/target.
ASSUMPTION: A successful live demonstration of the end-to-end workflow is the primary four-day project
outcome. Formal user testing, production security and launch readiness are outside this draft's confirmed
scope.

GYAN GARAGE | Draft PRDPage 6
- Five weakest points in this PRD
These are the biggest unresolved areas. They should be answered before or during Day 1 to reduce rework.
- Authentication and database are undefined
The notes mention login/signup and databases, but do not specify the backend, database, authentication method or
whether real multi-user access is required.
- Student and teacher permissions are underspecified
The PRD does not yet define class ownership, enrollment, teacher-student relationships, who can see which results, or
whether one teacher can manage multiple groups.
- Educational content and curriculum scope are unclear
The target includes more than SEE students, but exact grades, subjects, curriculum alignment, language coverage and
verified sample content have not been selected.
- Quiz and homework rules are incomplete
Question types, answer review, retakes, time-expiry behavior, homework submission and grading rules still need
decisions.
- Four-day capacity depends on the chosen stack and integration plan
The team has six members, but individual skills, chosen technology, current code status, hosting and task ownership are
not specified in the notes.
Open questions to resolve
-  TODO: [Confirm the MVP's supported grades, subjects and curriculum.]
-  TODO: [Confirm stack, database, authentication and hosting.]
-  TODO: [Confirm whether demo accounts are sufficient for the four-day presentation.]
-  TODO: [Confirm file upload versus external resource links.]
-  TODO: [Confirm quiz question types, timing rules and answer review.]
-  TODO: [Confirm homework submission and grading requirements.]
-  TODO: [Confirm the team member responsible for each Must feature and integration.]
End of draft PRD. This document uses only the project details supplied in the notes; unconfirmed decisions are explicitly marked as
TODOs or assumptions.