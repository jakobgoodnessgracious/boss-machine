const createError = (statusCode, message) => {
    const err = new Error(message); err.status = statusCode;
    return err;
}

const bodyValidatorCreator = (required) => (req, res, next) => {
    const requiredFields = [];
    const typedObject = {};
    const validate = (complexType, key, value) => {
        if (!complexType) {
            return;
        }
        let isCustomValid = true;
        let type, existsString;
        // check for broader customvalidators array
        const { customValidators = [] } = complexType;
        if (customValidators.length) {
            for (const cValidator in customValidators) {
                const [key, isValid] = cValidator(req, res, next);
                if (!isValid) {
                    requiredFields.push(key);
                    return;
                }
            }
        }
        ///
        // break down complex type object
        if (typeof complexType === 'string') {
            [type, existsString] = complexType.split(':');
        } else {
            const { type: cType, customValidator = () => true, exists } = complexType
            if (exists) {
                type = cType;
                existsString = 'exists';
            } else {
                [type, existsString] = cType.split(':');
            }
            isCustomValid = customValidator(req, res, next);
        }
        ///
        const exists = existsString === 'exists';
        if (type === 'number') {
            if (!isCustomValid) {
                requiredFields.push(key);
            } else if (exists && typeof value === type) {
                typedObject[key] = value;
            } else if (typeof value === type && value >= 0) {
                typedObject[key] = value;
            } else {
                requiredFields.push(key);
            }
        }
        if (type === 'string') {
            if (!isCustomValid) {
                requiredFields.push(key);
            } else if (exists && typeof value === type) {
                typedObject[key] = value;
            } else if (typeof value === type && value) {
                typedObject[key] = value;
            } else {
                requiredFields.push(key);
            }
        }
        if (type === 'date') {
            if (!isCustomValid) {
                requiredFields.push(key);
            } else if (exists && value instanceof Date) {
                typedObject[key] = value;
            } else if (value instanceof Date && !isNaN(value)) {
                typedObject[key] = value;
            } else {
                requiredFields.push(key);
            }
        }
    }
    Object.entries(req.body).forEach(([key, value]) => {
        let type = required[key];
        if (type && (type.put || type.post)) {
            Object.entries(type).forEach(([key, value]) => {
                if (req.method.toLowerCase() === key) {
                    type = value;
                }
            });
        }
        validate(type, key, value);
    });
    if (requiredFields.length) {
        next(createError(400, `Required fields: [${requiredFields.toString()}] are malformed or missing from the request body.`))
    } else {
        req.typedObject = typedObject;
        next();
    }
}

module.exports = {
    createError,
    bodyValidatorCreator
}