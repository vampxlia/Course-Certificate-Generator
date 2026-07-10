import { Enforcer, newEnforcer} from 'casbin';
import * as path from 'path';

let cachedEnforcer: Enforcer | null = null;

export async function getEnforcer() {
    if (cachedEnforcer) return cachedEnforcer;

    const modelPath = path.join(__dirname, '.', 'policies', 'model.conf');
    const policyPath = path.join(__dirname, '.', 'policies', 'policy.csv');

    cachedEnforcer = await newEnforcer(modelPath, policyPath);
    return cachedEnforcer;
}

module.exports = { getEnforcer };

