import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const hasRef = searchParams.get('ref');
        const title = hasRef
            ? 'A Friend Staked $5.\nAre You A Fraud?'
            : 'PinkySwear:\nAbsolute Accountability';

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        backgroundColor: '#00FF66',
                        border: '24px solid black',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            border: '12px solid black',
                            padding: '60px',
                            maxWidth: '85%',
                            boxShadow: '16px 16px 0px 0px #FF003C',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            fontSize: '24px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: '#FF003C',
                            paddingBottom: '20px'
                        }}>
                            pinkyswear.com
                        </div>

                        <h1
                            style={{
                                fontSize: '70px',
                                fontWeight: '900',
                                color: 'black',
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                                fontFamily: 'sans-serif',
                                margin: 0
                            }}
                        >
                            {title}
                        </h1>
                        <p
                            style={{
                                fontSize: '30px',
                                fontWeight: 'bold',
                                color: '#555',
                                marginTop: '40px',
                                fontFamily: 'sans-serif',
                            }}
                        >
                            Commit. Hit the deadline. Keep your money.
                        </p>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
