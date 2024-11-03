import type { Session, User } from "server/auth";

export type HonoContext = {
  Variables: {
    user: User;
    session: Session;
  };
};
