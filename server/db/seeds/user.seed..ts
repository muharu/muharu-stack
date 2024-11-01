import { eq } from "drizzle-orm";
import { db } from "..";
import { user as usersTable } from "../schema";
import { fakeDataGenerator } from "../utils/generator";

export async function userSeeder(numberOfUsers = 10) {
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

    await db.insert(usersTable).values(fakeUsers);
    console.log(`${numberOfUsers} new users created.`);

    // **READ**: Retrieve all users
    const users = await db.select().from(usersTable);
    console.log("All users in the database:", users);

    // **UPDATE**: Update `updatedAt` timestamp of all users
    const updatePromises = users.map((user) => {
      return db
        .update(usersTable)
        .set({ updatedAt: new Date() })
        .where(eq(usersTable.email, user.email));
    });

    await Promise.all(updatePromises);
    console.log("All users' updatedAt timestamps have been updated.");

    // **DELETE**: Delete all users
    await db.delete(usersTable);
    console.log("All users have been deleted.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
