import { service, characteristic } from './services';
import { Buffer } from 'buffer';

const sendCommand = (device, cmd, data) => {

    var sService = null;
    var sCharacteristic = null;
    var sBase = null;
    
    return new Promise((resolve, reject) => {
        device.writeCharacteristicWithResponseForService(sService, sCharacteristic, sBase, null)
            .then(c => {
                device.readCharacteristicForService(sService, sCharacteristic, null)
                    .then(a => {
                        var incoming = Buffer.from(a.value, 'base64').toString('ascii')
                        return resolve(JSON.parse(incoming))
                    })
            }).catch(e => {
                return reject(e);
            })
    })
}

const sendCommandWithoutResponse = (device, cmd, data) => {

    var sService = null;
    var sCharacteristic = null;
    var sBase = null;


    if(cmd == 'ledStatus'){
        var sendObject = { command: 'ledStatus', status: data.status }
        sBase = Buffer.from(JSON.stringify(sendObject)).toString('base64');
        sService = service.ledCmd;
        sCharacteristic = characteristic.ledCmd_status;
    
    }else if(cmd == 'ledValue'){
        var sendObject = { command: 'ledValue', hue: data.hue, sat: data.sat, val: data.val, bright: data.bright }
        sBase = Buffer.from(JSON.stringify(sendObject)).toString('base64');
        sService = service.ledCmd;
        sCharacteristic = characteristic.ledCmd_value;

    }else if(cmd == 'ledMode'){
        var sendObject = { command: 'ledMode', mode: data.mode }
        sBase = Buffer.from(JSON.stringify(sendObject)).toString('base64');
        sService = service.ledCmd;
        sCharacteristic = characteristic.ledCmd_mode;
    }


    return new Promise((resolve, reject) => {
        device.writeCharacteristicWithoutResponseForService(sService, sCharacteristic, sBase, null)
            .then(c => {
                return resolve()
            }).catch(e => {
                return reject(e);
            })
    })
}

export default {
    sendCommand,
    sendCommandWithoutResponse
}