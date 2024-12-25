/*
 * Mimium Pty. Ltd. ("LKG") CONFIDENTIAL
 * Copyright (c) 2022 Mimium project Pty. Ltd. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of LKG. The intellectual and technical concepts contained
 * herein are proprietary to LKG and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from LKG.  Access to the source code contained herein is hereby forbidden to anyone except current LKG employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 */

/**
 * Init Database schemas.
 */
import sequelize from "@src/config/database";
// TODO: We use the flyway instead init new models.
// import User from "@src/models/user.model";
// import Profile from "@src/models/profile.model";
// import Post from "@src/models/post.model";
// import UserGroup from "@src/models/user-group.model";
/**
 * Should exports entities to here to init new object model postgres.
 */
const initDb = async () => {
  try {
    console.log("Starting init db...");
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: true }); // Sync models with the database, true will be automatic sync new modes in db
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, initDb };