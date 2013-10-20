#include "mainwindow.h"
#include <QWebView>
#include <QtWidgets>
#include <QWebFrame>
#include <QDir>
#include <QApplication>
#include <QDebug>
#include <QWebPage>
#include <QObject>

/*
 *  Utility:
 *  ./exectuable pageAddress width height decoration
 *
 *   - pageAddress: the html file path or url
 *   - width:       integer that represent the width of the window
 *   - height:      integer that represent the height of the window
 *   - decoration:  if it is "UNDECORATED" the window will be undecorated (it will not have
 *                  borders and the window buttons
 *
 * */

/*
 *  Javascript functions (Public API)
 * */
class MyJavaScriptOperations : public QObject {
    Q_OBJECT
public:
    Q_INVOKABLE int sumOfNumbers(int a, int b) {
        qDebug() << a + b;
        return a + b;
    }
};

int main(int argc, char *argv[])
{

    QApplication app(argc, argv);

    // build the web view
    QWebView *view = new QWebView();

    // get the html path
    QString HTML_PATH       = QString(argv[1]);

    // the path is NOT a web site url
    if (!HTML_PATH.startsWith("htt"))
    {
        // get it from the local machine
        HTML_PATH = "file://" + QDir::current().absolutePath() + QDir::separator() + HTML_PATH;
    }

    // set window width and height
    int     WINDOW_WIDTH    = QString(argv[2]).toInt();
    int     WINDOW_HEIGHT   = QString(argv[3]).toInt();

    // handle "UNDECORATED" flag
    if (QString(argv[4]) == "UNDECORATED") {
        view->setWindowFlags(Qt::FramelessWindowHint);
    }

    // add the public api functions
    view->page()->mainFrame()->addToJavaScriptWindowObject("myOperations", new MyJavaScriptOperations);

    // resize the window
    view->resize(WINDOW_WIDTH, WINDOW_HEIGHT);

    // load that HTML file or website
    view->load(QUrl(HTML_PATH));

    // show the web view
    view->show();

    return app.exec();
}

#include "main.moc"
