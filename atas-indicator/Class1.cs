using ATAS.DataFeedsCore;
using ATAS.Indicators;
using Utils.Common.Logging;
using System.Text.Json;

public class DgLabIndicator : Indicator
{
    protected override void OnCalculate(int bar, decimal value)
    {
    }

    protected override void OnPositionChanged(Position position)
    {
        base.OnPositionChanged(position);
        DateTime now = DateTime.Now;

        string formattedTime = now.ToString("yyyy-MM-dd HH:mm:ss");
        var message = new
        {
            type = "position",
            data = position.IsInPosition ? position.UnrealizedPnL : 0,
            time = formattedTime,
            security = position.SecurityId,
            volume = position.Volume,
        };

        var jsonMessage = JsonSerializer.Serialize(message);
        string LOG_FILE_PATH = @"C:/trade.txt";
        try
        {
            File.AppendAllText(LOG_FILE_PATH, jsonMessage + Environment.NewLine);
        }
        catch (Exception ex)
        {
            this.LogError($"Fail to write to file: {ex.Message}");
        }

    }
}
