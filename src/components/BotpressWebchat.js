// import React, { useEffect, useRef } from 'react';

// const BotpressWebchat = () => {
//   const webchatContainerRef = useRef(null);

//   useEffect(() => {
//     if (window.BotpressWebChat) {
//       window.BotpressWebChat.default({
//         host: 'https://app.botpress.cloud/abg',
//         clientId: 'ABG InfoTech',
//         userId: 'user-123',
//         containerEl: webchatContainerRef.current,
//       });
//     }
//   }, []);

//   return <div ref={webchatContainerRef} />;
// };

// export default BotpressWebchat;