
import historyProvider from './historyProvider';

const subs = [];

export const subscribeBars = (
	// mainStrategy,
	symbolInfo,
	resolution,
	updateCb,
	uid
) => {
	const channelString = createChannelString(symbolInfo);

	const newSub = {
		channelString,
		uid,
		resolution,
		symbolInfo,
		lastBar: historyProvider.history[symbolInfo.name].lastBar,
		listener: updateCb
	};
	subs.push(newSub);
};

export const unsubscribeBars = uid => {
		const subIndex = subs.findIndex(e => e.uid === uid);
		if (subIndex === -1) {
				return;
		}
		subs.splice(subIndex, 1);
}

function createChannelString(symbolInfo) {
    const channel = symbolInfo.name.split(/[:/]/);
    const exchange = channel[0];
    const to = channel[2];
    const from = channel[1];
    return `0~${exchange}~${from}~${to}`;
}
