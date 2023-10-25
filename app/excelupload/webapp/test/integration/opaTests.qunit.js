sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/demo/excel/excelupload/test/integration/FirstJourney',
		'com/demo/excel/excelupload/test/integration/pages/UsersList',
		'com/demo/excel/excelupload/test/integration/pages/UsersObjectPage'
    ],
    function(JourneyRunner, opaJourney, UsersList, UsersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/demo/excel/excelupload') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheUsersList: UsersList,
					onTheUsersObjectPage: UsersObjectPage
                }
            },
            opaJourney.run
        );
    }
);