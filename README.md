# One Health toolkit Notification


## Introduction
This is a toolkit for One Health notification system

## Pre-requiestes for the script

Below are pre-requiested for the script to be able to clone and run the script successfully. Typescript mostly for building source code into **_js bundled_** codes for running the script.

```
- GIT
- Node v12+
- npm v6+
- typescript v4+
```

## Get started with script

To get start up we need to clone or [download](https://github.com/hisptz/one-health-toolkit-notification/archive/refs/heads/develop.zip) the source codes and having better under stand of source codes for set up prior development or run the script.

To clone the app, make sure you have installed the **GIT** command line and tun below command on the terminal

```
git clone https://github.com/hisptz/one-health-toolkit-notification.git
```

### Source code structure for script

Once codes strcture of downloaded or cloned script has below structure

```
one-health-toolkit-notification
|-- dist
|-- node_modules
|-- resources
|-- src
|   |-- app
|   |-- configs
|   |-- constants
|   |-- models
|   |-- utils
|   |--index.ts
|-- .gitigonre
|-- .prittierrc
|-- build-script.sh
|-- LICENSE
|-- package-lock.json
|-- package.json
|-- README.md
|-- run-notification-script.sh
|-- tsconfig.json
```
Based on above source code structure, folder or sub folder below is descriptions and contents under each

- **dist**: This is auto-generate folder contained compiled js bundled file from all ts files in `src` directory
- **node_modules**: This is autogenrate folder for all installed packages for supporting script to run. It generated on installation of all dependences of the scripts
- **resources**: This is autogenrate by the script, it contains generated logs files for the scripts as it run though put the process of updating beneficiary's status.
- **src**: This main srouce code directory, and the `index.ts` is the main entry file for the script. It contains below sub directories below:-
  - **app**: Contains all main process of the app including app process as well as running validation rules triggers with counting triggered notifications after run predictors and reading notifications sent over immediately trigger notifications
  - **configs**: This is for configurations of the script including access to dhis2 instance as well as other constanct necessary for trigger notifcations using validations and counting sent out notifications from the surveillance system.
  - **models**: Contains models/interfaces of script metadata necessary for the one health notification script.
  - **utils**: Contains utils functions or classes necessary for running the all process during trigger notifcations using validations and counting sent out notifications from the surveillance system.

### Setup & Configurations

Prior run the script need configurations of the script by set up acess credential to DHIS2 instance where the script will proxy for surveillance as well as other constanct necessary for trigger notifcations using validations and counting sent out notifications from the surveillance system.

To set up these configurations, create the file **app-config.ts** on **_`src/configs`_** with below contents

```
import { AppConfigModel, Dhis2NotificationMapping } from '../models';

export const appSourceConfig: AppConfigModel = {
  username: 'dhis_username',
  password: 'dhis_password',
  baseUrl: 'dhis_base_url'
};

export const DHIS2_ORGANISATION_UNIT_CONSTANT = {
  validationRuleOuLevel: 1 // level for ous used for organunits, ouId will be fetched by level
};

export const DHIS2_PREDICTOR_CONSTANT = {
  predictorGroups: [] // ids for predictors group
};

export const DHIS2_VALIDATION_RULE_CONSTANT = {
  validationRuleGroups: [], // ids for validation rule group for the notifications
  defaultNumberOfDays: 2 // number of month including current month get end date
};

export const DHIS2_MESSAGE_CONVERSATION_CONSTANT = {
  caseIdReference: '', //Case Id Prefix from notification template eg: caseIdReference: 'Event ID:',
  program: '', // program id reference
  filterAttribute: '' // attributes to filtrs
};

export const DHIS2_NOTIFICATION_MAPPING_CONSTANT: Dhis2NotificationMapping[] = [
  {
    dataElement: '', // ID for data element
    notificationSubjectPattern: '', // notification's subject pattern from subject
    diseasePattern: '' // disease pattern from subject
  }
];
```

After installation run below command to install neccessary packages for the script

```
npm install
```

## Operation of script 

After set up the script and install all script's dependences, you can run the app for development purpose or deployments.

For development, inorder to tracking changes as changing source codes, you can run below command while inside the script dicectory

```
npm run dev
```


For deployment, first need to build the script into mostly performant script then continue with running the script. To build the script, run below command

```
sh build-script.sh
```
The above command will generate `one-health-toolkit-notification.zip` under __dist__ folder, which contained complied script for execuation. To run the script, first extract the generated zipped file and starting using the script.

To running manually the script on specific date (let's say ___2024-06-24___) to count and trigger notifications for last seven days from specific date below is sample command
```
sh run-notification-script.sh 2024-06-24
```

**NB:** In case of running with specificed date, the sceript will pick current date as starting date to deduce the last seven days for running the script

To view script logs as the script is run or in progress, you can run below command while inside the extracted zip folder

```
tail -f resources/logs/logs.txt
```