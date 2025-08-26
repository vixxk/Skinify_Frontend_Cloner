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

PORT=8788

# Kill any existing process on this port
if lsof -i tcp:$PORT &>/dev/null; then
    OLD_PID=$(lsof -ti tcp:$PORT)
    echo "⚠️ Port $PORT is in use by PID $OLD_PID. Killing it..."
    kill -9 $OLD_PID
    sleep 1
fi

echo ""
echo "🚀 STARTING LIVE SERVER..."
echo "========================="

# Trap Ctrl+C to stop server
trap "echo '🛑 Stopping live server...'; exit" INT

# Run server in foreground
http-server . -p $PORT --cors -c-1 &
SERVER_PID=$!

# Wait a second to ensure server is ready
sleep 1

echo "🌐 Server running (PID: $SERVER_PID)"
echo "🌍 http://127.0.0.1:$PORT"

# Open browser
if command -v xdg-open &>/dev/null; then
    xdg-open "http://127.0.0.1:$PORT" &>/dev/null
elif command -v open &>/dev/null; then
    open "http://127.0.0.1:$PORT" &>/dev/null
fi

echo "🎉 Live server started at http://127.0.0.1:$PORT"
echo "Press Ctrl+C to stop."

# Keep script alive
wait $SERVER_PID
