const sendTokenToServer = async (token) => {
    try {
        const response = await fetch('https://your-server.com/api/push-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            console.log('푸시 토큰 서버 전송 성공');
        } else {
            console.error('푸시 토큰 서버 전송 실패');
        }
    } catch (error) {
        console.error('푸시 토큰 서버 전송 오류:', error.message);
    }
};
