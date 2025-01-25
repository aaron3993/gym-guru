/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const helloworld = onCall((context) => {
  logger.info("Hello, World Auth!", context.auth);
  logger.info("Hello, World Data!", context.data);
  return "Hello, World!";
});
