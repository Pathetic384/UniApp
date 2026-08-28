```bash
python main.py
```

```
University System: (A)dmin, (S)tudent, or X :
```
- `S` - go to the Student system
- `A` - go to the Admin system
- `X` - quit

**Student system** (`l/r/x`):
- `l` - login (for students who already registered)
- `r` - register (create a new student)
- `x` - back

After logging in you get the **Course menu** (`c/e/r/s/x`):
- `c` - change password
- `e` - enrol in a subject
- `r` - remove a subject
- `s` - show your subjects (with marks and grades)
- `x` - back

**Admin system** (`c/g/p/r/s/x`):
- `s` - show all students
- `g` - group students by grade
- `p` - split students into PASS / FAIL
- `r` - remove a student by ID
- `c` - clear all data
- `x` - back

## Rules

- **Email** must look like `firstname.lastname@university.com`.
- **Password** must start with a capital letter, have at least 5 more letters,
  then at least 3 digits (e.g. `Helloworld123`).
- A student can enrol in **at most 4 subjects**.
- Each subject gets a random mark (25-100) and a grade:
  `< 50 = Z`, `50-64 = P`, `65-74 = C`, `75-84 = D`, `85+ = HD`.
- A student **passes** if their average mark is 50 or more.

## Example: register and enrol

```
University System: (A)dmin, (S)tudent, or X : S
        Student System (l/r/x): r
        Student Sign Up
        Email: john.smith@university.com
        Password: Helloworld123
        email and password formats acceptable
        Name: John Smith
        Enrolling Student John Smith
        Student System (l/r/x): l
        Student Sign In
        Email: john.smith@university.com
        Password: Helloworld123
        email and password formats acceptable
        Student Course Menu (c/e/r/s/x): e
        Enrolling in Subject-541
        You are now enrolled in 1 out of 4 subjects
        Student Course Menu (c/e/r/s/x): s
        Showing 1 subjects
        [ Subject::541 -- mark = 72 -- grade =  C ]
        Student Course Menu (c/e/r/s/x): x
        Student System (l/r/x): x
University System: (A)dmin, (S)tudent, or X : X
Thank You
```

## Example: admin

```
University System: (A)dmin, (S)tudent, or X : A
        Admin System (c/g/p/r/s/x): s
        Student List
        John Smith :: 002340 --> Email: john.smith@university.com
        Admin System (c/g/p/r/s/x): p
        PASS/FAIL Partition
        FAIL --> []
        PASS --> [John Smith :: 002340 --> GRADE:  C - MARK: 72.00]
        Admin System (c/g/p/r/s/x): x
University System: (A)dmin, (S)tudent, or X : X
Thank You
```
