using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Reflection;

[assembly: AssemblyTitle("Taskbar Bunny")]
[assembly: AssemblyProduct("Taskbar Bunny")]
[assembly: AssemblyDescription("Taskbar Bunny")]
[assembly: AssemblyCompany("Taskbar Bunny Team")]
[assembly: AssemblyFileVersion("1.0.0.0")]
[assembly: AssemblyVersion("1.0.0.0")]

namespace TaskbarBunny
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string targetExe = Path.Combine(baseDir, "dist", "win-unpacked", "Taskbar Bunny.exe");
                
                if (!File.Exists(targetExe))
                {
                    targetExe = Path.Combine(baseDir, "Taskbar Bunny.exe");
                }

                if (!File.Exists(targetExe))
                {
                    MessageBox.Show(
                        "Could not locate 'dist\\win-unpacked\\Taskbar Bunny.exe'.\nPlease run 'npm run pack' first.",
                        "Taskbar Bunny",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error
                    );
                    return;
                }

                ProcessStartInfo psi = new ProcessStartInfo(targetExe);
                psi.WorkingDirectory = Path.GetDirectoryName(targetExe);
                psi.UseShellExecute = true;
                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    "Error starting Taskbar Bunny:\n" + ex.Message,
                    "Taskbar Bunny",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error
                );
            }
        }
    }
}
