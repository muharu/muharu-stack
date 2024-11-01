import { eq } from "drizzle-orm";
import { db } from ".";
import { userTable } from "./schema";
import { fakeDataGenerator } from "./utils/generator";

async function seeder() {
  await userSeeder();
}

seeder();

async function userSeeder(numberOfUsers = 10) {
  try {
    // **CREATE**: Generate multiple fake users with additional fields
    const fakeUsers = Array.from({ length: numberOfUsers }).map(() => ({
      id: fakeDataGenerator.string.uuid(),
      name: fakeDataGenerator.person.fullName(),
      email: fakeDataGenerator.internet.email(),
      emailVerified: fakeDataGenerator.datatype.boolean(),
      image: fakeDataGenerator.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.insert(userTable).values(fakeUsers);
    console.log(`${numberOfUsers} new users created.`);

    // **READ**: Retrieve all users
    const data = await db.select().from(userTable);
    console.log("All users in the database:", userTable);

    // **UPDATE**: Update `updatedAt` image of all users
    const updatePromises = data.map((user) => {
      return db
        .update(userTable)
        .set({ image: fakeDataGenerator.image.avatar() })
        .where(eq(userTable.email, user.email));
    });

    await Promise.all(updatePromises);
    console.log("All users' updatedAt timestamps have been updated.");

    // **DELETE**: Delete all users
    await db.delete(userTable);
    console.log("All users have been deleted.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
