export const getConnectedAddressForUser = async (fid: number) => {
    const res = await fetch(`https://hub.pinata.cloud/v1/verificationByFid?fic=${fid}`)
    const json = await res.json();
    const address = json.messages[0].data.verificationAddressBody.address
    return address
}


