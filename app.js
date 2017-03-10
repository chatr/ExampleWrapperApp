(function(doc, win) {
    function convertOptions(options) {
        console.info(options);

        if (!options.button) options.button = {};
        if (!options.window) options.window = {};
        if (!options.colors) options.colors = {};

        return {
            buttonStyle: options.button.style,
            buttonSize: options.button.size? parseInt(options.button.size): void 0,
            buttonPosition: options.button.position,
            chatWidth: options.window.width? parseInt(options.window.width): void 0,
            chatHeight: options.window.height? parseInt(options.window.height): void 0,
            zIndex: options.zIndex,
            colors: {
                buttonText: options.button.textColor,
                buttonBg: options.button.bgColor,
                chatBg: options.colors.chatBg,
                clientBubbleBg: options.colors.clientBubbleBg,
                agentBubbleBg: options.colors.agentBubbleBg
            },
            mobileOnly: options.mobileOnly,
            disabledOnMobile: options.disabledOnMobile,
            language: options.language,
            mode: options.injectTo? 'frame': 'widget',
            injectTo: options.injectTo? doc.querySelector(options.injectTo): void 0,
            groupId: options.groupId
        };
    }

    function initialize(options) {
        win.ChatraSetup = convertOptions(options);

        win.ChatraID = options.chatraId;

        var s = doc.createElement('script');
        win.Chatra = win.Chatra || function() {
            (win.Chatra.q = win.Chatra.q || []).push(arguments);
        };
        s.async = true;
        s.src = (doc.location.protocol === 'https:' ? 'https:': 'http:')
        + '//call.chatra.io/chatra.js';
        if (doc.head) doc.head.appendChild(s);
    }

    win.CFChatraSetOptions = function(options) {
        var newChatraSetup = convertOptions(options);

        if (options.chatraId != win.ChatraID) {
            win.ChatraID = options.chatraId;
            win.ChatraSetup = newChatraSetup;
            Chatra('restart');
        }
        else if (
            win.ChatraSetup.buttonStyle != newChatraSetup.buttonStyle ||
            win.ChatraSetup.mobileOnly != newChatraSetup.mobileOnly ||
            win.ChatraSetup.disabledOnMobile != newChatraSetup.disabledOnMobile ||
            win.ChatraSetup.language != newChatraSetup.language ||
            win.ChatraSetup.mode != newChatraSetup.mode ||
            win.ChatraSetup.injectTo != newChatraSetup.injectTo
        ) {
            win.ChatraSetup = newChatraSetup;
            Chatra('restart');
        }
        else {
            var chatButtonChanged = false;
            var chatWindowChanged = false;

            if (win.ChatraSetup.buttonSize != newChatraSetup.buttonSize) {
                Chatra('setButtonSize', newChatraSetup.buttonSize);
                chatButtonChanged = true;
            }
            if (win.ChatraSetup.buttonPosition != newChatraSetup.buttonPosition) {
                Chatra('setButtonPosition', newChatraSetup.buttonPosition);
                chatButtonChanged = true;
            }

            if (win.ChatraSetup.chatWidth != newChatraSetup.chatWidth) {
                Chatra('setChatWidth', newChatraSetup.chatWidth);
                chatWindowChanged = true;
            }
            if (win.ChatraSetup.chatHeight != newChatraSetup.chatHeight) {
                Chatra('setChatHeight', newChatraSetup.chatHeight);
                chatWindowChanged = true;
            }

            if (win.ChatraSetup.zIndex != newChatraSetup.zIndex)
                Chatra('setZIndex', newChatraSetup.zIndex);
            if (win.ChatraSetup.groupId != newChatraSetup.groupId)
                Chatra('setGroupId', newChatraSetup.groupId);

            if (
                win.ChatraSetup.colors.buttonText != newChatraSetup.colors.buttonText ||
                win.ChatraSetup.colors.buttonBg != newChatraSetup.colors.buttonBg
            ) {
                Chatra('setColors', newChatraSetup.colors);
                chatButtonChanged = true;
            }
            else if (
                win.ChatraSetup.colors.chatBg != newChatraSetup.colors.chatBg ||
                win.ChatraSetup.colors.clientBubbleBg != newChatraSetup.colors.clientBubbleBg ||
                win.ChatraSetup.colors.agentBubbleBg != newChatraSetup.colors.agentBubbleBg
            ) {
                Chatra('setColors', newChatraSetup.colors);
                chatWindowChanged = true;
            }

            if (chatButtonChanged && !chatWindowChanged) Chatra('minimizeWidget');
            else if (chatWindowChanged && !chatButtonChanged) Chatra('expandWidget');

            win.ChatraSetup = newChatraSetup;
        }
    };

    initialize(INSTALL_OPTIONS);

})(document, window);
