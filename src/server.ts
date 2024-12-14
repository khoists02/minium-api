import app from "./app";
import config from "@src/config/app";

const port = config.port;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});