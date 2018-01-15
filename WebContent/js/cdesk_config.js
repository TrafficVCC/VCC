var names = ['路网提取','事故定位','道路分析','热点分析'];
    var desk = cDesk.DeskBox().getInstance(names);
    var tool = cDesk.Toolbar().getInstance(desk, {
        setBtn3Title: '主题设置',
        outBtnHandler: function () {
            var themes = cDesk.Themes().getInstance();
            themes.AddTheme({
                themeName: '抽象1',
                themeIcon: 'cDesk/theme/themeList/min/抽象1.png',
                themeImage: 'cDesk/theme/themeList/抽象1.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '抽象2',
                themeIcon: 'cDesk/theme/themeList/min/抽象2.png',
                themeImage: 'cDesk/theme/themeList/抽象2.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '抽象3',
                themeIcon: 'cDesk/theme/themeList/min/抽象3.png',
                themeImage: 'cDesk/theme/themeList/抽象3.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '动物1',
                themeIcon: 'cDesk/theme/themeList/min/动物1.png',
                themeImage: 'cDesk/theme/themeList/动物1.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '动物2',
                themeIcon: 'cDesk/theme/themeList/min/动物2.png',
                themeImage: 'cDesk/theme/themeList/动物2.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '动物3',
                themeIcon: 'cDesk/theme/themeList/min/动物3.png',
                themeImage: 'cDesk/theme/themeList/动物3.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '风景1',
                themeIcon: 'cDesk/theme/themeList/min/风景1.png',
                themeImage: 'cDesk/theme/themeList/风景1.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '风景2',
                themeIcon: 'cDesk/theme/themeList/min/风景2.png',
                themeImage: 'cDesk/theme/themeList/风景2.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '风景3',
                themeIcon: 'cDesk/theme/themeList/min/风景3.png',
                themeImage: 'cDesk/theme/themeList/风景3.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '卡通玄幻1',
                themeIcon: 'cDesk/theme/themeList/min/卡通玄幻1.png',
                themeImage: 'cDesk/theme/themeList/卡通玄幻1.png',
                themeCss: '',
                setCallback: function (d) { }
            });
            themes.AddTheme({
                themeName: '卡通玄幻2',
                themeIcon: 'cDesk/theme/themeList/min/卡通玄幻2.png',
                themeImage: 'cDesk/theme/themeList/卡通玄幻2.png',
                themeCss: '',
                setCallback: function (d) { }
            });
        }
    });