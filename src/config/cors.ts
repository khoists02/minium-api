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
import cors from "cors";
import appConfig from "./app";

const allowOrigins = appConfig.allowOrigins?.split(",") || ["http://localhost:3000"]

const corsOptions: cors.CorsOptions = {
  origin: allowOrigins, // Add allowed origins here
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies or authentication headers
  exposedHeaders: ['X-Total-Count'], // Headers to expose
  optionsSuccessStatus: 204 // Status for preflight OPTIONS requests
};

export default cors(corsOptions);