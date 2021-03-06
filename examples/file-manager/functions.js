$(document).ready(function () {

    $(document).on("contextmenu", function () {
        return false;
    });

    var $files = $(".files");

    var $templates = {
        "file":     $(".template.file").clone().removeClass("template"),
        "folder":   $(".template.folder").clone().removeClass("template"),
        "dirpath":  $(".path > .template.dir").clone().removeClass("template")
    };


    $(".template.file").remove();
    $(".template.folder").remove();
    $(".path > .template.dir").remove();

    $files.on("dblclick", "[data-path]", function () {
        var path = $(this).attr("data-path");
        if ($(this).hasClass("file")) {

            var err = BAT.runBash("xdg-open " + path).stderr;
            if (err) {
                alert("Error: " + err);
                return;
            }
            return;
        }
        readDir(path);
        return false;
    }).on("click", ".file,.folder", function (e) {
        if (!e.ctrlKey) {
            $(".file,.folder").removeClass("selected");
        }
        $(this).toggleClass("selected");
    });

    $(".path").on("click", "[data-path]", function () {
        var path = $(this).attr("data-path");
        readDir(path);
        return false;
    });

    function getPathTo(folder, fullPath) {
        var pathToFolder = "";
        return fullPath.substr(0, fullPath.indexOf(folder) + folder.length + 1);
    }

    function renderPath (path) {
        BAT.setWindowTitle(path);
        var dirs = path.split("/");
        var $dirs = [];
        for (var i = 0; i < dirs.length - 1; ++i) {
            $dirs.push(
                $templates["dirpath"]
                    .clone()
                    .attr("data-path", getPathTo(dirs[i], path))
                    .text((tmp = dirs[i]) ? tmp : "root")
            );
        }

        var $path = $(".path");
        $path.find(".dir:not('.not-remove')").remove()
        $path.append($dirs);
    }

    window.readDir = function readDir (cDir) {
        $files.empty();
        renderPath(cDir);
        var commandRes = BAT.runBash("ls " + cDir + " -F --group-directories-first");
        if (commandRes.stderr) {
            $files.html(commandRes.stderr);
        }
        var filesAndDirs = getFilesAndDirs(commandRes.stdout);
        for (var i = 0; i < filesAndDirs.length - 1; ++i) {
            var cFileOrDir = filesAndDirs[i];
            var isFolder = cFileOrDir.slice(-1) === "/" ? true : false;

            if (isFolder) {
                cFileOrDir = cFileOrDir.substr(0, cFileOrDir.length - 1);
            }

            var $template = $templates[isFolder ? "folder" : "file"];

            var $newFileOrDir = $template
                                    .clone()
                                    .attr("data-path", cDir + filesAndDirs[i])
            $newFileOrDir.find(".name").text(cFileOrDir)

            $files.append($newFileOrDir);
        }
    }


    readDir("/home/");

    function getFilesAndDirs (output) {
        return output.split("\n");
    }
});
