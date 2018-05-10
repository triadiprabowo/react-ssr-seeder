import fetch from 'isomorphic-fetch'

export function getBank(dispatch) {
  const encodedURI = encodeURI(`https://api-internal.tunaiku.com/general/bank`)

  return fetch(encodedURI)
	.then((data) => data.json())
	.then((data) => data.result)
	.catch((error) => {
		console.warn(error)
		return null
	});
}