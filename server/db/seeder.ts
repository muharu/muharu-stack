import { userSeeder } from "./seeds/user.seed.";

async function seeder() {
  await userSeeder();
}

seeder();
