(function(doc, win) {
    function convertOptions(options) {
        console.info(options);

        if (!options.button) options.button = {};
        if (!options.window) options.window = {};
        if (!options.advanced) options.advanced = {};

        // var injectEl;
        // if (options.advanced.inject && options.advanced.injectTo) {
        //     injectEl = INSTALL.createElement(options.advanced.injectTo);
        //     injectEl.style.display = 'block';
        //     injectEl.style.height = options.advanced.injectHeight+'px';
        // }

        var result = {
            buttonStyle: options.button.style || void 0,
            buttonSize: parseInt(options.button.size) || void 0,
            buttonPosition: options.button.position || void 0,
            chatWidth: parseInt(options.window.width) || void 0,
            chatHeight: parseInt(options.window.height) || void 0,
            zIndex: options.advanced.zIndex !== null? options.advanced.zIndex: void 0,
            mobileOnly: options.advanced.devices == 'mob',
            disabledOnMobile: options.advanced.devices == 'notMob',
            language: options.advanced.language || void 0,
            mode: options.advanced.inject && options.advanced.injectTo? 'frame': 'widget',
            injectTo: options.advanced.injectTo? doc.querySelector(options.advanced.injectTo): void 0,
            groupId: options.advanced.groupId || void 0
        };

        result.colors = {};

        if (options.button.textColor) result.colors.buttonText = options.button.textColor;
        if (options.button.bgColor) result.colors.buttonBg = options.button.bgColor;
        if (options.window.bgColor) result.colors.chatBg = options.window.bgColor;
        if (options.window.clientBubbleBg) result.colors.clientBubbleBg = options.window.clientBubbleBg;
        if (options.window.agentBubbleBg) result.colors.agentBubbleBg = options.window.agentBubbleBg;

        return result;
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

        console.info(newChatraSetup);

        if (options.chatraId != win.ChatraID) {
            win.ChatraID = options.chatraId;
            win.ChatraSetup = newChatraSetup;
            Chatra('restart');
        }
        else if (
            win.ChatraSetup.buttonStyle != newChatraSetup.buttonStyle
        ) {
            win.ChatraSetup = newChatraSetup;
            Chatra('restart');
            Chatra('minimizeWidget');
        }
        else if (
            win.ChatraSetup.mobileOnly != newChatraSetup.mobileOnly ||
            win.ChatraSetup.disabledOnMobile != newChatraSetup.disabledOnMobile ||
            win.ChatraSetup.language != newChatraSetup.language ||
            win.ChatraSetup.mode != newChatraSetup.mode ||
            win.ChatraSetup.injectTo != newChatraSetup.injectTo
        ) {
            var isExpanded = Chatra._chatExpanded;

            win.ChatraSetup = newChatraSetup;
            Chatra('restart');
            if (isExpanded) Chatra('expandWidget');
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

            if (chatButtonChanged && !chatWindowChanged && Chatra._chatExpanded) Chatra('minimizeWidget');
            else if (chatWindowChanged && !chatButtonChanged && !Chatra._chatExpanded) Chatra('expandWidget');

            win.ChatraSetup = newChatraSetup;
        }
    };

    initialize(INSTALL_OPTIONS);

})(document, window);
