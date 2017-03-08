let mailjet = angular.module('mailjet', [
    'ngResource',
    'ngSanitize',
    'ngMessages',
    'ngAnimate'
]).controller('MailjetCtrl', ($scope, $rootScope, AddonsService, QueryService) => {
    $scope.AddonsService = AddonsService

    $scope.setup = () => {
        AddonsService.setup($rootScope.app.addons.get('@materia/mailjet'))
    }

    $scope.send = (ev) => {
        QueryService.execute($rootScope.app.entities.get('mailjet').getQuery('send'), null, ev)
    }

    $rootScope.$on('query::run', (e, data) => {
        if (data.entity == 'mailjet' && data.query == 'send') {
            init()
        }
    })

    function init() {
        $rootScope.app.entities.get('mailjet').getQuery('latest').run().then(emails => {
            $scope.emails = emails.data
            $scope.nbEmails = emails.count
            $scope.$apply()
        }).catch(e => {
            console.log('error', e, e.stack)
        })
    }

    init()
})
module.exports = mailjet