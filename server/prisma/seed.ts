import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
// Import the PrismaClient
const prisma = new PrismaClient();

// Define the directory where your JSON data files are stored
const dataDirectory = path.join(__dirname, "seedData");

async function deleteAllData(
  orderedFileNames: string[],
  tx: Prisma.TransactionClient
) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model = (tx as any)[modelName as keyof Prisma.TransactionClient];
    if (!model) {
      throw new Error(`Model "${modelName}" does not exist on the Prisma client.`);
    }
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

// Simple validation example: ensure jsonData is an object
function isValidData(data: any): boolean {
  // Add model-specific validation as needed
  return data && typeof data === "object";
}

async function main() {
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  // Check if dataDirectory exists
  if (!fs.existsSync(dataDirectory)) {
    throw new Error(`Data directory "${dataDirectory}" does not exist.`);
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await deleteAllData(orderedFileNames, tx);

    for (const fileName of orderedFileNames) {
      const filePath = path.join(dataDirectory, fileName);

      if (!fs.existsSync(filePath)) {
        console.error(`File ${fileName} does not exist in data directory, skipping.`);
        continue;
      }

      let fileContent: string;
      try {
        fileContent = await fs.promises.readFile(filePath, "utf-8");
      } catch (err) {
        console.error(`Unable to read ${fileName}:`, err);
        continue;
      }

      let jsonData: any;
      try {
        jsonData = JSON.parse(fileContent);
      } catch (err) {
        console.error(`Invalid JSON in ${fileName}:`, err);
        continue;
      }

      const modelName = path.basename(fileName, path.extname(fileName));
      const model = (tx as any)[modelName as keyof Prisma.TransactionClient];

      if (!model) {
        throw new Error(`Model "${modelName}" does not exist on the Prisma client.`);
      }

      // Validate data before inserting
      if (!Array.isArray(jsonData)) {
        console.error(`Invalid data format in ${fileName}: Expected an array.`);
        continue;
      }
      const validData = jsonData.filter(isValidData);
      if (validData.length !== jsonData.length) {
        console.error(`Some invalid data detected in ${fileName}, skipping invalid entries.`);
      }

      try {
        await model.createMany({ data: validData });
        console.log(`Seeded ${modelName} with data from ${fileName}`);
      } catch (error) {
        console.error(`Error seeding data for ${modelName}:`, error);
      }
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());