class Mailjet {
    constructor(app, config) {
        this.app = app
        this.config = config
    }

    getModule() { return "web/js/main.js" }
    getTemplate() { return "web/index.html" }

    getInstallTemplate() { return "web/install.html" }
    getInstallCtrl() { return "UserManagementInstallCtrl" }

    start() {}

    uninstall(app) {}
}

module.exports = Mailjet