
export default class MailjetAddon {
  public static displayName = 'Mailjet';
  public static logo = 'https://raw.githubusercontent.com/materiahq/materia-website-content/master/logo/addons/mailjet.jpg';

  public static installSettings = [
    {
      name: 'apikey',
      description: 'Enter your apikey',
      type: 'string',
      required: true
    },
    {
      name: 'secret',
      description: 'Enter your secret key',
      type: 'string',
      required: true
    },
    {
      name: 'from',
      description: 'Enter the email address (sender) attached with your apikey',
      type: 'string',
      required: true,
      component: 'email'
    },
    {
      name: 'name',
      description: 'Enter the name you would like to see appear on your email',
      type: 'string',
      required: true
    }
  ];

  constructor(app, config) { }

  start() {
  }

  uninstall(app) { }
}
