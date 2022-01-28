class MessageUtil {
    constructor(){
    }

    static info(){
        return {
            
        };
    }

    static warning(){
        return {
            
        };
    }

    static error(){
        return {
            RECORD_NOT_FOUND : 'Record not found',
            IMAGE_NOT_BASE64 : 'Image format is not base64',
            ERROR_OCCURRED: 'An Internal error occurred, please after sometime',
            PROFILE_ALREADY_REGISTERED : 'We cannot register your profile as it is already registered with us.',
            TOKEN_AUTHENTICATION_FAILURE : 'Failed to authenticate token.',
            TOKEN_NOT_PROVIDED : 'No token provided.',
            INCORRECT_PASSWORD : 'Incorrect Password',
            AUTHENTICATION_USER_NOT_FOUND : ' User does not exist',
            AUTHENTICATION_WRONG_PASSWORD : 'Invalid User ID or Password’',
            MULTIPLE_ATTEMPTS_LOGIN : 'You have entered wrong credentials 3 times. Your account has been blocked. Please contact admin.',
            ACCOUNT_NOT_ACTIVE : 'User account is not active. Please click on verification link sent to your registered email ID to activate account',
            REGISTER_USER_EXIST : 'Registration failed. User email already exists',
            REGISTER_CUSTOMER_EXIST : 'Registration failed. Customer already exists',
            USER_EXIST : 'User already exists',
            USER_PHONE_EXIST : 'User phone already exists. Please choose different one',
            USER_EMAIL_EXIST : 'User email already exists. Please provide different one',
            CUSTOMER_EXIST : 'Customer already exists',
            USER_NOT_EXIST : 'User does not exist',
            CUSTOMER_NOT_EXIST : 'Customer does not exist',
           
            PLAN_NOT_EXIST : 'No plans found for the condition',
            
            UNABLE_TO_PROCESS_REQUEST : 'We are unable to process your request at this time.',
            BOT_INACTIVE : 'Bot is not active. Please contact administrator.',
            SERVICE_VOICE_NOT_SUBSCRIBE : 'Voice service is not subscribed',
            WEBHOOK_URL_MISSING : 'Bot webhook url is missing',
            ERROR_MISSING_POOL : 'ERROR MISSING POOL',
            ERROR_DATABASE_CONNECTION : 'ERROR DATABASE CONNECTION',
            NO_RESPONSE : 'I did not get any response for your query. May be you are not providing relevant information.',
            TEMPLATE_NOT_EXIST:'Template type does not exist',
            TEMPLATE_NOT_MATCH:'Template type does not match',
            NO_RESPONSE_FROM_NLP: 'I did not get any response from nlp',
            ENTITY_REFERENCE_EXISTS : 'Entity is being used by one of the bot flow.',
            
            DOCUMENT_SEARCH_RESULT_NOT_FOUND : 'Sorry, I could not found any search result for your query.',
            DOCUMENT_SEARCH_URL_MISSING : 'Sorry, I could not found search url to proceed with your query.',
            DOCUMENT_CATEGORY_EXISTS_ON_BOT: 'Document Category already exist for the selected bot and customer.',        
		    ASR_SERVICE_ERROR:'Unable to process request please try again',
            CUSTOMER_ID_MISSING: 'Please provide the customer id with your request',
            NOTIFICATION_SENT : 'Notification successfully sent',
            FORM_DATA_PARSING_ERROR: 'Error occurred while parsing form data',
            UPLOADING_FILES_MISSING : 'There are no files to upload',
            ACCOUNT_INACTIVE : 'Please activate your account first',
            INVALID_URL : 'INVALID URL',
            INSTANT_HELP_TYPE_EXISTS : 'Instant Help type already exists.',
            INVALID_IMAGE_TYPE : 'Invalid image type',
           
        };
    }

    static response(){
        return {
            ERROR : "ERROR",
            SUCCESS : "SUCCESS"
        };
    }

    static message() {
        return {
            INSIDE_FETCH_CUSTOMER_CONFIG:'Inside Fetch Customer Config',
            INSIDE_FETCH_BOT_CONFIG:'Inside Fetch Bot Config',
            BOT_KEY_NOT_FOUND_NO_TOKEN:'Bot Key Not Found or No token provided ',
            BOT_CONFIG_NOT_FOUND:'Bot config not found in Redis Fetching from DB',
            BOT_CONFIG_NOT_FOUND_REDIS:'Bot config found in Redis',
            CUSTOMER_ID_NOT_PROVIDED:'Customer Id not provided ',
            CUSTOMER_NOT_EXIST:'Customer  not exists ',
            BOT_NOT_EXIST:'Bot  not exists ',
            CONFIRM_HUMONICS_ACCOUNT:'Please confirm your Humonics account',
            BOT_CONSOLE_APPL_INFO:'Bot Console Application Info',
            NEW_CUSTOMER_REGISTRATION:'New Customer Registration\n\n',
            AGENT_ADMIN_CONNECTED:'agentAdminConnected',
            INSIDE_AUTHENTICATE_BOT:'Inside Authenticate Bot',
            SUCCESS_RESPONE_BOT_AUTH:'Success Response For Bot Auth ',
            BOT_VALIDATION_FAILED:'Bot validation Failed',
            INSIDE_CHAT_RESET:'Inside Chat Reset',
            INSIDE_CHAT_TEXT:'Inside Chat text',
            CHAT_PARAM:'Chat Param',
            INSIDE_FETCH_NOTIFICATION:'Inside Fetch Notifications',
            INSIDE_UPDATE_NOTIFICATION:'Inside Update Notification',
            INSIDE_APPROVAL_NOTIFICATION:'Inside Notification Approval',
            WEBHOOK_URL_MISSING:'Webhook URL Missing',
            CLIENT_WEBHOOK_FETCH_NOTIFICATION:'Client Webhook Fetch Notification : ',
            CLIENT_WEBHOOK_CONFIRM_NOTIFICATION:'Client Webhook Notification Confirm',
            CLIENT_WEBHOOK_UPDATE_NOTIFICATION:'Client Webhook Update Notification : "',
            CLIENT_WEBHOOK_APPROVAL_NOTIFICATION:'Client Webhook Notification Approval: ',
            INSIDE_NOTIFICATION:'Inside Notification Confirm',
            NO_TOKEN_PROVIDED:'No token provided',
            TOKEN_AUTHENTICATION_FAILED:'Failed to authenticate token',
            INSIDE_API_AI_BOT_HANDLER:'Inside Api AI Bot Handler',
            NO_FLOW:'No flow for bot_key',
            INSIDE_BOT_RESPONSE_HANDLER:'Inside Bot Response Handler',
            INSIDE_FETCH_USER_AGENT_RESPONSE:'Inside Fetch User/Agent Response Rasa',
            INSIDE_USER_AGENT_RESPONSE:'Inside User/Agent Response Handler',
            INSIDE_CALL_BOTS_STATS:'Inside Call Bot Stats Scheduler',
            UPDATING_BOT_STATS:'UPDATING BOT STATS',
            BAD_REQUEST: 'Bad Request',
            QUEUE_ALREADY_EXIST: 'Queue Name Already Exist',
            QUEUE_NOT_PRESENT: 'Queue Not Present',
            QUEUE_MEMBER_NOT_PRESENT: 'Queue Member Not Present',
        };
    }
}

module.exports = MessageUtil;
