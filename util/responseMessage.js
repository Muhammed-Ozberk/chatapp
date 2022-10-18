module.exports = {
    notFound: (param) => {
        return `Not found ${param}.`;
    },
    requiredParameter: (param) => {
        return `Not found ${param}. Please, entry ${param} parameter.`;
    },
    invalidParameter: (param) => {
        return `Invalid parameter: ${param}`;
    },
    missingParameter: (param) => {
        return `Please, entry body parameter: ${param}.`;
    },
    invalidQueryParameter: (param) => {
        return `Invalid query parameter: ${param}`;
    },
    missingQueryParameter: (param) => {
        return `Please, entry query parameter: ${param}.`;
    },
    notInList: (param) => {
        return `${param} Not in List`;
    },
    unauthorized: (param) => {
        return `Wrong ${param}. Please, check your parameters.`;
    },
    create: (param) => {
        return `${param} is created.`;
    },
    list: (param) => {
        return `All ${param} listed.`;
    },
    update: (param) => {
        return `${param} is updated.`;
    },
    delete: (param) => {
        return `${param} is deleted.`;
    },
    errorWhenDelete: (param) => {
        return `${param} when error deleting.`;
    }
};