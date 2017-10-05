(function() {
    var demoChatraId = INSTALL_ID == 'preview'? 'hX8ihkAcyHK93ue99': void 0;
    var demoGroupId = INSTALL_ID == 'preview'? 'BKjdxwGNFhDE4DJ2r': void 0;
    var currentChatraId;

    function convertOptions(options, isDemo) {
        var useChatraButtonSettings = options.button.useChatraSettings && !isDemo;

        if (!options.button) options.button = {};
        if (!options.window) options.window = {};
        if (!options.advanced) options.advanced = {};

        var result = {
            chatWidth: parseInt(options.window.width) || void 0,
            chatHeight: parseInt(options.window.height) || void 0,
            zIndex: options.advanced.zIndex !== null? options.advanced.zIndex: void 0,
            mobileOnly: options.advanced.devices == 'mob',
            disabledOnMobile: options.advanced.devices == 'notMob',
            language: options.advanced.language || (isDemo? 'en': void 0)
        };

        if (isDemo || options.advanced.groupId) {
            result.groupId = isDemo? demoGroupId: options.advanced.groupId;
        }

        if (!useChatraButtonSettings) {
            result.buttonStyle = options.button.style || void 0;
            result.buttonSize = parseInt(options.button.size) || void 0;
            result.buttonPosition = options.button.position || void 0;
        }

        result.colors = {};

        if (!useChatraButtonSettings && options.button.textColor) result.colors.buttonText = options.button.textColor;
        if (!useChatraButtonSettings && options.button.bgColor) result.colors.buttonBg = options.button.bgColor;
        if (options.window.bgColor) result.colors.chatBg = options.window.bgColor;
        if (options.window.clientBubbleBg) result.colors.clientBubbleBg = options.window.clientBubbleBg;
        if (options.window.agentBubbleBg) result.colors.agentBubbleBg = options.window.agentBubbleBg;

        return result;
    }

    function initialize(options) {
        var chatraId = (options.account || {}).userId;

        window.ChatraSetup = convertOptions(options, !chatraId);

        currentChatraId = chatraId;
        window.ChatraID = chatraId || demoChatraId;
        window.ChatraProtocol = 'https:';

        var s = document.createElement('script');
        window.Chatra = window.Chatra || function() {
            (window.Chatra.q = window.Chatra.q || []).push(arguments);
        };
        s.async = true;
        s.src = 'https://call.chatra.io/chatra.js';
        if (document.head) document.head.appendChild(s);
    }

    window.INSTALL_SCOPE.setOptions = function(options) {
        var newChatraId = (options.account || {}).userId;
        var newChatraSetup = convertOptions(options, !newChatraId);

        if (newChatraId != currentChatraId) {
            currentChatraId = newChatraId;
            window.ChatraID = newChatraId || demoChatraId;
            window.ChatraSetup = newChatraSetup;
            Chatra('restart');
        }
        else if (
            window.ChatraSetup.buttonStyle != newChatraSetup.buttonStyle
        ) {
            window.ChatraSetup = newChatraSetup;
            Chatra('restart');
            Chatra('minimizeWidget');
        }
        else if (
            window.ChatraSetup.mobileOnly != newChatraSetup.mobileOnly ||
            window.ChatraSetup.disabledOnMobile != newChatraSetup.disabledOnMobile ||
            window.ChatraSetup.language != newChatraSetup.language
        ) {
            var isExpanded = Chatra._chatExpanded;

            window.ChatraSetup = newChatraSetup;
            Chatra('restart');
            if (isExpanded) Chatra('expandWidget');
        }
        else {
            var chatButtonChanged = false;
            var chatWindowChanged = false;

            if (window.ChatraSetup.buttonSize != newChatraSetup.buttonSize) {
                Chatra('setButtonSize', newChatraSetup.buttonSize);
                chatButtonChanged = true;
            }
            if (window.ChatraSetup.buttonPosition != newChatraSetup.buttonPosition) {
                Chatra('setButtonPosition', newChatraSetup.buttonPosition);
                chatButtonChanged = true;
            }

            if (window.ChatraSetup.chatWidth != newChatraSetup.chatWidth) {
                Chatra('setChatWidth', newChatraSetup.chatWidth);
                chatWindowChanged = true;
            }
            if (window.ChatraSetup.chatHeight != newChatraSetup.chatHeight) {
                Chatra('setChatHeight', newChatraSetup.chatHeight);
                chatWindowChanged = true;
            }

            if (window.ChatraSetup.zIndex != newChatraSetup.zIndex)
                Chatra('setZIndex', newChatraSetup.zIndex);
            if (window.ChatraSetup.groupId != newChatraSetup.groupId)
                Chatra('setGroupId', newChatraSetup.groupId? newChatraSetup.groupId: null);

            if (
                window.ChatraSetup.colors.buttonText != newChatraSetup.colors.buttonText ||
                window.ChatraSetup.colors.buttonBg != newChatraSetup.colors.buttonBg
            ) {
                Chatra('setColors', newChatraSetup.colors);
                chatButtonChanged = true;
            }
            else if (
                window.ChatraSetup.colors.chatBg != newChatraSetup.colors.chatBg ||
                window.ChatraSetup.colors.clientBubbleBg != newChatraSetup.colors.clientBubbleBg ||
                window.ChatraSetup.colors.agentBubbleBg != newChatraSetup.colors.agentBubbleBg
            ) {
                Chatra('setColors', newChatraSetup.colors);
                chatWindowChanged = true;
            }

            if (chatButtonChanged && !chatWindowChanged && Chatra._chatExpanded) Chatra('minimizeWidget');
            else if (chatWindowChanged && !chatButtonChanged && !Chatra._chatExpanded) Chatra('expandWidget');

            window.ChatraSetup = newChatraSetup;
        }
    };

    initialize(INSTALL_OPTIONS);
})();
