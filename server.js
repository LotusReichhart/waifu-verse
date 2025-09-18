import {app} from "./src/app/app.js";
import {appConfig} from "./src/config/app-config.js";
import {loggerHelper} from "./src/shared/utils/logger-helper.js";

const PORT = appConfig.server.port;

app.listen(PORT, () => {
    loggerHelper.info(`Server running at port ${PORT}`);
});
