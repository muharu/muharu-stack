import { eq } from "drizzle-orm";
import { db } from "..";
import { usersTable } from "../schema";
import { fakeDataGenerator } from "../utils/generator";

export async function userSeeder(numberOfUsers = 10) {
  try {
    // **CREATE**: Generate multiple fake users
    const fakeUsers = Array.from({ length: numberOfUsers }).map(() => ({
      name: fakeDataGenerator.person.fullName(),
      age: fakeDataGenerator.number.int({ min: 18, max: 65 }),
      email: fakeDataGenerator.internet.email(),
    }));

    await db.insert(usersTable).values(fakeUsers);
    console.log(`${numberOfUsers} new users created.`);

    // **READ**: Retrieve all users
    const users = await db.select().from(usersTable);
    console.log("All users in the database:", users);

    // **UPDATE**: Update ages of all users
    const updatePromises = users.map((user) => {
      const newAge = fakeDataGenerator.number.int({ min: 18, max: 65 });
      return db
        .update(usersTable)
        .set({ age: newAge })
        .where(eq(usersTable.email, user.email));
    });

    await Promise.all(updatePromises);
    console.log("All users' ages have been updated.");

    // **DELETE**: Delete all users
    await db.delete(usersTable);
    console.log("All users have been deleted.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}
