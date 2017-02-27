let mailjet = angular.module('mailjet', [
    'ngResource',
    'ngSanitize',
    'ngMessages',
    'ngAnimate'
]).controller('MailjetCtrl', ($scope, $rootScope) => {
    $rootScope.app.entities.get('email').getQuery('latest').run().then(emails => {
        console.log('emails', emails)
        $scope.emails = emails.data
        $scope.nbEmails = emails.count
        $scope.$apply()
    }).catch(e => {
        console.log('error', e, e.stack)
    })
    console.log('in app !', $rootScope.app)
}).controller('EmailInstallCtrl', ($scope, $rootScope) => {
    
})
module.exports = mailjet