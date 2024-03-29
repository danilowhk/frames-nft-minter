import { NextRequest, NextResponse } from "next/server"
import { getConnectedAddressForUser } from "../../../utils/fc";
import { mintNft, balanceOf } from "../../../utils/mint";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT as string,
    pinata_gateway: process.env.GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
    console.log("get called");
    try {
        const frameMetadata = await fdk.getFrameMetadata({
            post_url: `${process.env.BASE_URL}/frame`,
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
    const body = await req.json();
    const fid = body.untrustedData.fid;
    const address = await getConnectedAddressForUser(fid);
    const balance = await balanceOf(address);
    console.log(balance);
    if (typeof balance === "number" && balance !== null && balance < 1){
        try {
            const mint = await mintNft(address);
            console.log(mint);
            const frameMetadata = await fdk.getFrameMetadata({
                post_url: `${process.env.BASE_URL}/redirect`,
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
            post_url: `${process.env.BASE_URL}/redirect`,
            buttons: [{ label: "Learn How to Make This", action: "post_redirect"}],
            aspect_ratio:"1:1",
            cid: "QmQub6Jhqq14mNzjG28AFYwmk5itvbwE54N7Jd3qZkEJGf",
        });
        return new NextResponse(frameMetadata);
        }
    }
