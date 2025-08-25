clear
echo "SETTING UP..."
echo "==================="

if [ ! -f "index.html" ]; then
    echo "❌ ERROR: index.html not found!"
    exit 1
fi

echo "✅ Found index.html"

if ! command -v node &>/dev/null; then
    echo "❌ Node.js not found!"
    exit 1
fi

echo "✅ Node.js found"

if ! command -v http-server &>/dev/null; then
    echo "📦 Installing http-server globally..."
    npm install -g http-server || { echo "❌ Failed to install http-server"; exit 1; }
    echo "✅ http-server installed!"
else
    echo "✅ http-server ready"
fi

PORT=8080
echo ""
echo "🚀 STARTING LIVE SERVER..."
echo "========================="

# Start server in background, detached from terminal
nohup http-server . -p $PORT --cors -c-1 > /dev/null 2>&1 &

echo "🌐 Server running in background (PID: $!)"
echo "🌍 http://127.0.0.1:$PORT"

if command -v xdg-open &>/dev/null; then
    xdg-open "http://127.0.0.1:$PORT" &>/dev/null
elif command -v open &>/dev/null; then
    open "http://127.0.0.1:$PORT" &>/dev/null
fi

echo "🎉 Live server started at http://127.0.0.1:$PORT"
echo "Source Code: https://github.com/vixxk"
exit 0
