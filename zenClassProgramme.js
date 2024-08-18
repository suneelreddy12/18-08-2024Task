/* creating collections
users
codekata
attendance
topics
tasks
company_drives
mentors */

db.users.insertMany([
  {
    _id: ObjectId(),
    name: "Suneel",
    email: "suneel@example.com",
  },
  {
    _id: ObjectId(),
    name: "Ajay",
    email: "ajay@example.com",
  },
  {
    _id: ObjectId(),
    name: "Venkat",
    email: "venkat@example.com",
  },
  {
    _id: ObjectId(),
    name: "Karthik",
    email: "karthik@example.com",
  },
]);

db.topics.insertMany([
  {
    _id: ObjectId(),
    name: "React",
    date: ISODate("2020-10-10"),
  },
  {
    _id: ObjectId(),
    name: "HTML",
    date: ISODate("2020-10-11"),
  },
  {
    _id: ObjectId(),
    name: "CSS",
    date: ISODate("2020-10-12"),
  },
  {
    _id: ObjectId(),
    name: "JavaScript",
    date: ISODate("2020-10-13"),
  },
  {
    _id: ObjectId(),
    name: "MongoDB",
    date: ISODate("2020-10-14"),
  },
]);

db.tasks.insertMany([
  {
    _id: ObjectId(),
    topic_id: db.topics.findOne({ name: "React" })._id,
    name: "React Task 1",
    due_date: ISODate("2020-10-12"),
    submitted: true,
    user_id: db.users.findOne({ name: "Suneel" })._id,
  },
  {
    _id: ObjectId(),
    topic_id: db.topics.findOne({ name: "HTML" })._id,
    name: "HTML Task 1",
    due_date: ISODate("2020-10-13"),
    submitted: true,
    user_id: db.users.findOne({ name: "Ajay" })._id,
  },
  {
    _id: ObjectId(),
    topic_id: db.topics.findOne({ name: "CSS" })._id,
    name: "CSS Task 1",
    due_date: ISODate("2020-10-14"),
    submitted: false,
    user_id: db.users.findOne({ name: "Venkat" })._id,
  },
  {
    _id: ObjectId(),
    topic_id: db.topics.findOne({ name: "JavaScript" })._id,
    name: "JavaScript Task 1",
    due_date: ISODate("2020-10-15"),
    submitted: true,
    user_id: db.users.findOne({ name: "Karthik" })._id,
  },
  {
    _id: ObjectId(),
    topic_id: db.topics.findOne({ name: "MongoDB" })._id,
    name: "MongoDB Task 1",
    due_date: ISODate("2020-10-16"),
    submitted: false,
    user_id: db.users.findOne({ name: "Suneel" })._id,
  },
]);

db.codekata.insertMany([
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Suneel" })._id,
    problems_solved: 120,
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Ajay" })._id,
    problems_solved: 150,
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Venkat" })._id,
    problems_solved: 200,
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Karthik" })._id,
    problems_solved: 180,
  },
]);
db.attendance.insertMany([
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Suneel" })._id,
    date: ISODate("2020-10-16"),
    status: "absent",
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Ajay" })._id,
    date: ISODate("2020-10-16"),
    status: "present",
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Venkat" })._id,
    date: ISODate("2020-10-16"),
    status: "absent",
  },
  {
    _id: ObjectId(),
    user_id: db.users.findOne({ name: "Karthik" })._id,
    date: ISODate("2020-10-16"),
    status: "present",
  },
]);
db.company_drives.insertMany([
  {
    _id: ObjectId(),
    company_name: "ABC Corp",
    date: ISODate("2020-10-20"),
    students_appeared: [
      db.users.findOne({ name: "Suneel" })._id,
      db.users.findOne({ name: "Ajay" })._id,
    ],
  },
  {
    _id: ObjectId(),
    company_name: "XYZ Ltd",
    date: ISODate("2020-10-25"),
    students_appeared: [
      db.users.findOne({ name: "Venkat" })._id,
      db.users.findOne({ name: "Karthik" })._id,
    ],
  },
]);
db.mentors.insertMany([
  {
    _id: ObjectId(),
    name: "Mentor A",
    mentee_count: 20,
    mentees: [
      db.users.findOne({ name: "Suneel" })._id,
      db.users.findOne({ name: "Ajay" })._id,
    ],
  },
  {
    _id: ObjectId(),
    name: "Mentor B",
    mentee_count: 10,
    mentees: [
      db.users.findOne({ name: "Venkat" })._id,
      db.users.findOne({ name: "Karthik" })._id,
    ],
  },
]);

// 1. Find all the topics and tasks which are taught in the month of October
db.topics.aggregate([
  {
    $match: {
      date: { $gte: ISODate("2020-10-01"), $lt: ISODate("2020-11-01") },
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "topic_id",
      as: "tasks",
    },
  },
]);

// 2. Find all the company drives which appeared between 15-Oct-2020 and 31-Oct-2020
db.company_drives.find({
  date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") },
});

// 3.Find all the company drives and students who appeared for the placement
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "students_appeared",
      foreignField: "_id",
      as: "students",
    },
  },
]);

//4. Find the number of problems solved by the user in codekata
db.codekata.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_details",
    },
  },
  {
    $project: {
      "user_details.name": 1,
      problems_solved: 1,
    },
  },
]);

//5. Find all the mentors who have a mentee count greater than 15
db.mentors.find({
  mentee_count: { $gt: 15 },
});

//6. Find the number of users who are absent and task is not submitted between 15-Oct-2020 and 31-Oct-2020
db.attendance.aggregate([
  {
    $match: {
      date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") },
      status: "absent",
    },
  },
  {
    $lookup: {
      from: "tasks",
      localField: "user_id",
      foreignField: "user_id",
      as: "tasks",
    },
  },
  {
    $unwind: "$tasks",
  },
  {
    $match: {
      "tasks.submitted": false,
      "tasks.due_date": {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31"),
      },
    },
  },
  {
    $group: {
      _id: "$user_id",
      count: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user_details",
    },
  },
  {
    $project: {
      "user_details.name": 1,
      count: 1,
    },
  },
]);
