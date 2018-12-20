const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validators = {
    isStringNullOrEmpty: (value) => {
        return !value || value.trim().length === 0;
    },
    isStringBelowMinLength: (value, minLength) => {
        return value.length < minLength;
    },
    isStringAboveMaxLength: (value, maxLength) => {
        return value.length > maxLength;
    },
    isInvalidEmail: (value) => {
        return !emailRegex.test(String(value).toLowerCase());
    }
}

export default validators;