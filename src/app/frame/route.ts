import { NextRequest, NextResponse } from "next/server"
import { getConnectedAddressForUser } from "../../../utils/fc";
import { mintNft, balanceOf } from "../../../utils/mint";
import { PinataFDK } from "pinata-fdk";
import { privateKeyToAccount } from "viem/accounts";

const userAddress = '0x8BF5932E7245865Ac9fb35c07907967A8B5375dB';
const fdk = new PinataFDK({
    pinata_jwt: process.env.NEXT_PUBLIC_PINATA_JWT as string,
    pinata_gateway: process.env.NEXT_PUBLIC_GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
    console.log("get called");
    try {
        const frameMetadata = await fdk.getFrameMetadata({
            post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/frame`,
            buttons: [{ label: "Mint 1 NFT", action: "post"}],
            aspect_ratio: "1:1",
            cid: "QmQub6Jhqq14mNzjG28AFYwmk5itvbwE54N7Jd3qZkEJGf",
        });
        return new NextResponse(frameMetadata);
    } catch(error){
        console.log(error)
        return NextResponse.json({ error: error });
    }
}

export async function POST(req: NextRequest, res: NextResponse) { 
    console.log("Post called");
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x`);
    const body = await req.json();
    const fid = body.untrustedData.fid;
    // const address = await getConnectedAddressForUser(fid);
    const address = userAddress;
    const balance = await balanceOf(address);
    console.log(balance);
    if (typeof balance === "number" && balance !== null && balance < 10){
        try {
            const mint = await mintNft(address,account);
            console.log(mint);
            const frameMetadata = await fdk.getFrameMetadata({
                post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/redirect`,
                buttons: [{ label: "Learn How to Make This", action: "post_redirect"}],
                aspect_ratio:"1:1",
                cid: "QmQub6Jhqq14mNzjG28AFYwmk5itvbwE54N7Jd3qZkEJGf",
            });
            return new NextResponse(frameMetadata);
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: error });
        }
    } else {
        const frameMetadata = await fdk.getFrameMetadata( {
            post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/redirect`,
            buttons: [{ label: "Learn How to Make This", action: "post_redirect"}],
            aspect_ratio:"1:1",
            cid: "QmQub6Jhqq14mNzjG28AFYwmk5itvbwE54N7Jd3qZkEJGf",
        });
        return new NextResponse(frameMetadata);
        }
    }
