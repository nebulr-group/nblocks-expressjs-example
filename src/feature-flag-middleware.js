const fetch = require('node-fetch');

const featureFlag = ({ flag }) => {
    const appId = "64d0e87061597800086fcd42";
                    

    return (req, res, next) => {
        const accessToken = req.headers['authorization'];
        if (accessToken) {
             evaluate(flag, accessToken.split("Bearer ")[1], appId).then(enabled => {
                if (enabled)
                    next();
                else
                    res.status(403).send({ message: 'Forbidden' });
            });
        } else {
            res.status(401).send({ message: 'Unauthorized' });
        }
    };
};

const evaluate = async (flag, accessToken, appId) => {
    const result = await fetch(
        `https://backendless-stage.nblocks.cloud/flags/evaluate/${appId}/${flag}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
            }),
        }
    ).then((res) => res.json());
    return result.enabled;
};

module.exports = { featureFlag }