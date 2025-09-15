import { app } from "./src/app/app.js";
import { appConfig } from "./src/config/app-config.js";

const PORT = appConfig.server.port;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
