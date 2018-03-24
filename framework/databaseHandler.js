import pg from 'pg';
import db_config from '../../config/.db.config.json';

const pool = new pg.Pool(db_config);

pool.on('error', (err, client) => {
    console.error('idle client error', err, client);
});

//region SQL&Helper
/**
 * Late Binding
 * @param qp
 * @param values
 * @returns {{qp: *, values: *[]}}
 */
export const lb = (qp, ...values) => {
    return { qp, values };
};

/**
 *
 * @param qp
 * @param values
 * @returns {{qp: string, explicit: boolean}}
 */
export const e = (qp, ...values) => {
    let res = '';
    for (let i = 0; i < qp.length - 1; i++) {
        res += qp[i] + values[i].toString();
    }
    return { qp: res + qp[qp.length - 1], explicit: true };
};

export const query = async (qp, ...values) => {
    let query = '';
    let index = 1;
    for (let i = 0; i < qp.length - 1; i++) {
        if (
            typeof values[i] === 'object' &&
            values[i] &&
            values[i].hasOwnProperty('qp') &&
            values[i].hasOwnProperty('values')
        ) {
            query += qp[i];
            for (let k = 0; k < values[i].qp.length - 1; k++) {
                query += values[i].qp[k] + '$' + index++;
            }
            query += values[i].qp[values[i].qp.length - 1];
            values.splice(i, 1, ...values[i].values);
        } else if (
            typeof values[i] === 'object' &&
            values[i] &&
            values[i].hasOwnProperty('qp') &&
            values[i].explicit
        ) {
            query += qp[i] + values[i].qp;
            values.splice(i, 1);
        } else {
            query += qp[i] + '$' + index++;
        }
    }
    query += qp[qp.length - 1];

    const client = await pool.connect();
    try {
        return await client.query(query, values);
    } catch (err) {
        console.error(query, values, err);
        return false;
    } finally {
        client.release();
    }
};

export const lbjoin = (...args) => {
    const qp = [''];
    const values = [];

    for (let i = 0; i < args.length - 1; i++) {
        if (
            typeof args[i] === 'object' &&
            args[i] &&
            args[i].hasOwnProperty('qp') &&
            args[i].hasOwnProperty('values')
        ) {
            qp[qp.length - 1] += args[i].qp[0];
            for (let k = 1; k < args[i].qp.length - 1; k++) {
                qp.push(args[i].qp[k]);
            }
            qp.push(args[i].qp[args[i].qp.length - 1] + ', ');
            values.push(...args[i].values);
        }
    }
    if (
        args.length > 0 &&
        typeof args[args.length - 1] === 'object' &&
        args[args.length - 1] &&
        args[args.length - 1].hasOwnProperty('qp') &&
        args[args.length - 1].hasOwnProperty('values')
    ) {
        qp[qp.length - 1] += args[args.length - 1].qp[0];
        for (let k = 1; k < args[args.length - 1].qp.length; k++) {
            qp.push(args[args.length - 1].qp[k]);
        }
        values.push(...args[args.length - 1].values);
    }
    return { qp, values };
};

//endregion SQL&Helper
