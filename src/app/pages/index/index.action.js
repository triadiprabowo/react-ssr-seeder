import fetch from 'isomorphic-fetch';
import Q from 'q';

export function getBank(dispatch) {
  const encodedURI = encodeURI(`https://api-internal.tunaiku.com/general/bank`);

  return fetch(encodedURI)
	.then((data) => data.json())
	.then((data) => {
		 dispatch({ type: 'GET_BANK', payload: data.result});
		 return data.result;
	})
	.catch((error) => {
		console.warn(error)
		return null
	});
}

export function getProvince(dispatch) {
  const encodedURI = encodeURI(`https://api-internal.tunaiku.com/general/regions?type=province`);

  return fetch(encodedURI)
	.then((data) => data.json())
	.then((data) => {
		 dispatch({ type: 'GET_PROVINCE', payload: data.result });
		 return data.result;
	})
	.catch((error) => {
		console.warn(error)
		return null
	});
}

export default function OnInit(dispatch) {
	dispatch({ type: 'PREFETCH_INDEX', fetching: true });

	return Q.all([getBank(dispatch), getProvince(dispatch)]).then((data) => dispatch({type: 'PREFETCH_INDEX', fetching: false}));
}